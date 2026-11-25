/**
 * IvoireMap - Systeme de navigation GPS temps reel (Abidjan : Gbaka, Woro-woro, SOTRA)
 *
 * Fonctionnalites :
 * 1. watchPosition() en priorite absolue (enableHighAccuracy: true) avec fallback simulation si GPS refuse
 * 2. Map-matching (projection orthogonale / snap-to-route sur le segment le plus proche)
 * 3. Progression calculee sur la distance reellement parcourue sur le graphe (en metres)
 * 4. Detection de deviation (> 150m de tout segment pendant > 30s) -> onDeviation
 * 5. Recalcul automatique apres deviation confirmee -> onReroute(userLat, userLng)
 * 6. Alertes de descente a 300m et 80m avec navigator.vibrate + SpeechSynthesis (fr-FR)
 */

import { calculateBearing, haversineDistance } from "./geo";
import type { DescenteAlert, NavigationProgress, Route, RouteStep } from "./types";

export type NavigationMode = "gps" | "simulation";

export interface DescenteAlertPayload extends DescenteAlert {
  thresholdMeters: 300 | 80;
}

export interface NavigationCallbacks {
  onProgressUpdate?: (progress: NavigationProgress) => void;
  onNextStep?: (stepIndex: number, step: RouteStep) => void;
  onAlertDescente?: (alert: DescenteAlertPayload) => void;
  onDeviation?: (distanceMeters: number, userLat: number, userLng: number) => void;
  onReroute?: (userLat: number, userLng: number) => void;
  onNavigationEnd?: (route: Route) => void;
  onUpdateUserLocation?: (lat: number, lng: number, heading: number) => void;
  onPanTo?: (lat: number, lng: number, zoom?: number) => void;
  onModeChange?: (mode: NavigationMode) => void;
  onGpsError?: (error: GeolocationPositionError | Error) => void;
}

export interface NavigationOptions {
  /** Seuil de deviation en metres (defaut: 150) */
  deviationThresholdMeters?: number;
  /** Duree avant confirmation de deviation en ms (defaut: 30000) */
  deviationDurationMs?: number;
  /** Seuil d'alerte approche arret en metres (defaut: 300) */
  alertFarMeters?: number;
  /** Seuil d'alerte descente imminente en metres (defaut: 80) */
  alertNearMeters?: number;
  /** Rayon de validation d'arrivee finale en metres (defaut: 35) */
  arrivalThresholdMeters?: number;
  /** Delai minimum entre deux demandes de recalcul en ms (defaut: 15000) */
  rerouteCooldownMs?: number;
  /** Activer la synthese vocale (defaut: true) */
  enableVoice?: boolean;
  /** Activer les vibrations (defaut: true) */
  enableVibration?: boolean;
  /** Vitesse de simulation en m/s a 1x (defaut: 8.5 m/s ~ 30 km/h) */
  simulationSpeedMps?: number;
}

interface SnapResult {
  snappedLat: number;
  snappedLng: number;
  distanceMeters: number;
  segmentIndex: number;
  t: number;
  heading: number;
  coveredDistance: number;
}

const DEFAULT_OPTIONS: Required<NavigationOptions> = {
  deviationThresholdMeters: 150,
  deviationDurationMs: 30_000,
  alertFarMeters: 300,
  alertNearMeters: 80,
  arrivalThresholdMeters: 35,
  rerouteCooldownMs: 15_000,
  enableVoice: true,
  enableVibration: true,
  simulationSpeedMps: 8.5,
};

const METERS_PER_DEG_LAT = 111_320;

export class IvoireNavigation {
  private callbacks: NavigationCallbacks;
  private options: Required<NavigationOptions>;

  private route: Route | null = null;
  private mode: NavigationMode = "gps";
  private isRunning = false;

  // Geolocation watch
  private watchId: number | null = null;
  private hasReceivedGpsFix = false;
  private consecutiveTimeouts = 0;

  // Simulation fallback
  private simTimerId: ReturnType<typeof setInterval> | null = null;
  private simPlaying = false;
  private simSpeedMultiplier = 1;
  private simDistanceMeters = 0;

  // Geometrie precalculee du graphe / itineraire
  private cumulativeDistances: number[] = [];
  private totalRouteDistance = 0;
  private stepEndDistances: number[] = [];

  // Etat de progression
  private currentStepIndex = 0;
  private maxCoveredDistance = 0;
  private lastHeading = 0;
  private alerted300m = new Set<number>();
  private alerted80m = new Set<number>();

  // Etat de deviation & recalcul
  private deviationStartTime: number | null = null;
  private deviationConfirmed = false;
  private lastRerouteAt = 0;

  constructor(callbacks: NavigationCallbacks = {}, options: NavigationOptions = {}) {
    this.callbacks = callbacks;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /** Demarre la navigation sur un itineraire donne */
  start(route: Route): void {
    this.stop();

    this.route = route;
    this.isRunning = true;
    this.resetProgressState();
    this.precomputeRouteGeometry(route);

    if (route.coordinates.length < 2 || this.totalRouteDistance === 0) {
      this.handleArrival();
      return;
    }

    this.startGpsTracking();
  }

  /** Met a jour l'itineraire en cours (ex: apres un recalcul Dijkstra via onReroute) */
  updateRoute(newRoute: Route): void {
    if (!this.isRunning) {
      this.start(newRoute);
      return;
    }

    this.route = newRoute;
    this.resetProgressState();
    this.precomputeRouteGeometry(newRoute);

    if (newRoute.coordinates.length < 2 || this.totalRouteDistance === 0) {
      this.handleArrival();
    }
  }

  /** Arrete completement la navigation (GPS, simulation et synthese vocale) */
  stop(): void {
    this.isRunning = false;
    this.clearGpsWatch();
    this.clearSimulationTimer();
    this.simPlaying = false;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore les erreurs speechSynthesis sur certains navigateurs mobiles
      }
    }

    this.route = null;
  }

  /** Retourne le mode actif ("gps" ou "simulation") */
  getMode(): NavigationMode {
    return this.mode;
  }

  /** Indique si la navigation est active */
  getIsRunning(): boolean {
    return this.isRunning;
  }

  /** Controle lecture/pause en mode simulation */
  setSimulationPlaying(playing: boolean): void {
    if (this.mode !== "simulation" || !this.isRunning) return;
    this.simPlaying = playing;
    if (playing && !this.simTimerId) {
      this.runSimulationLoop();
    } else if (!playing) {
      this.clearSimulationTimer();
    }
  }

  /** Definit le multiplicateur de vitesse en mode simulation (ex: 1, 2, 5) */
  setSimulationSpeed(multiplier: number): void {
    this.simSpeedMultiplier = Math.max(0.5, multiplier);
  }

  /** Bascule manuellement en mode simulation (utile pour les tests ou mode demo) */
  forceSimulationMode(): void {
    if (!this.isRunning || !this.route) return;
    this.clearGpsWatch();
    this.startSimulationFallback();
  }

  // ---------------------------------------------------------------------------
  // 1. Tracking GPS prioritaire + Fallback Simulation
  // ---------------------------------------------------------------------------

  private startGpsTracking(): void {
    if (
      typeof navigator === "undefined" ||
      !("geolocation" in navigator) ||
      typeof navigator.geolocation.watchPosition !== "function"
    ) {
      this.callbacks.onGpsError?.(new Error("Geolocalisation non supportee par ce navigateur"));
      this.startSimulationFallback();
      return;
    }

    this.mode = "gps";
    this.hasReceivedGpsFix = false;
    this.consecutiveTimeouts = 0;
    this.callbacks.onModeChange?.("gps");

    try {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handleGpsPosition(position),
        (error) => this.handleGpsError(error),
        {
          enableHighAccuracy: true,
          maximumAge: 2000,
          timeout: 10_000,
        }
      );
    } catch (err) {
      this.callbacks.onGpsError?.(err instanceof Error ? err : new Error(String(err)));
      this.startSimulationFallback();
    }
  }

  private handleGpsPosition(position: GeolocationPosition): void {
    if (!this.isRunning || !this.route || this.mode !== "gps") return;

    this.hasReceivedGpsFix = true;
    this.consecutiveTimeouts = 0;

    const { latitude, longitude } = position.coords;
    this.processPosition(latitude, longitude, false);
  }

  private handleGpsError(error: GeolocationPositionError): void {
    this.callbacks.onGpsError?.(error);

    // Permission refusee (code 1) ou position indisponible (code 2) -> fallback immediat
    if (error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE) {
      this.clearGpsWatch();
      this.startSimulationFallback();
      return;
    }

    // Timeout (code 3) : si aucun fix obtenu apres 2 tentatives, fallback simulation
    if (error.code === error.TIMEOUT) {
      this.consecutiveTimeouts += 1;
      if (!this.hasReceivedGpsFix && this.consecutiveTimeouts >= 2) {
        this.clearGpsWatch();
        this.startSimulationFallback();
      }
    }
  }

  private clearGpsWatch(): void {
    if (this.watchId !== null && typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(this.watchId);
    }
    this.watchId = null;
  }

  private startSimulationFallback(): void {
    if (!this.isRunning || !this.route) return;

    this.mode = "simulation";
    this.simPlaying = true;
    this.simDistanceMeters = this.maxCoveredDistance;
    this.callbacks.onModeChange?.("simulation");

    this.clearSimulationTimer();
    this.runSimulationLoop();
  }

  private runSimulationLoop(): void {
    if (!this.isRunning || !this.route || !this.simPlaying) return;

    const tickMs = 250;
    this.simTimerId = setInterval(() => {
      if (!this.isRunning || !this.route || !this.simPlaying) {
        this.clearSimulationTimer();
        return;
      }

      const deltaMeters = this.options.simulationSpeedMps * this.simSpeedMultiplier * (tickMs / 1000);
      this.simDistanceMeters = Math.min(this.totalRouteDistance, this.simDistanceMeters + deltaMeters);

      const pos = this.getCoordinatesAtDistance(this.simDistanceMeters);
      if (pos) {
        this.processPosition(pos.lat, pos.lng, true);
      }

      if (this.simDistanceMeters >= this.totalRouteDistance) {
        this.clearSimulationTimer();
      }
    }, tickMs);
  }

  private clearSimulationTimer(): void {
    if (this.simTimerId !== null) {
      clearInterval(this.simTimerId);
      this.simTimerId = null;
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Map-matching & 3. Progression sur distance reelle + 4/5. Deviation
  // ---------------------------------------------------------------------------

  private processPosition(rawLat: number, rawLng: number, isSimulated: boolean): void {
    if (!this.route || !this.isRunning) return;

    const snap = this.snapToRoute(rawLat, rawLng, this.route.coordinates);
    if (!snap) return;

    // Verifier deviation uniquement en mode GPS reel
    if (!isSimulated) {
      this.evaluateDeviation(snap.distanceMeters, rawLat, rawLng);
    }

    // Distance parcourue sur le graphe (lissage anti-recul mineur de 5m du au bruit GPS)
    const coveredDistance =
      snap.coveredDistance >= this.maxCoveredDistance - 5
        ? Math.max(this.maxCoveredDistance, snap.coveredDistance)
        : snap.coveredDistance;

    this.maxCoveredDistance = coveredDistance;

    const progressFraction =
      this.totalRouteDistance > 0 ? Math.min(1, Math.max(0, coveredDistance / this.totalRouteDistance)) : 1;

    // Position affichee = position projetee sur l'itineraire (jamais la position GPS brute)
    const displayLat = snap.snappedLat;
    const displayLng = snap.snappedLng;
    const heading = snap.heading;

    this.callbacks.onUpdateUserLocation?.(displayLat, displayLng, heading);
    this.callbacks.onPanTo?.(displayLat, displayLng);

    // Etape courante et distance restante jusqu'a l'arret de l'etape
    const steps = this.route.steps;
    if (steps.length === 0) return;

    // Avancer l'index d'etape si la distance parcourue depasse la fin de l'etape courante
    while (
      this.currentStepIndex < steps.length - 1 &&
      coveredDistance >= this.stepEndDistances[this.currentStepIndex] - this.options.alertNearMeters
    ) {
      this.currentStepIndex += 1;
      this.callbacks.onNextStep?.(this.currentStepIndex, steps[this.currentStepIndex]);
    }

    const currentStep = steps[this.currentStepIndex];
    const stepEndDist = this.stepEndDistances[this.currentStepIndex] ?? this.totalRouteDistance;
    const distAlongGraphToStepEnd = Math.max(0, stepEndDist - coveredDistance);
    const directDistToStepEnd = haversineDistance(
      displayLat,
      displayLng,
      currentStep.toPlace.lat,
      currentStep.toPlace.lng
    );
    const distToStepEnd = Math.round(Math.min(distAlongGraphToStepEnd, directDistToStepEnd));

    // 6. Alertes de descente a 300m et 80m
    this.checkDescenteAlerts(this.currentStepIndex, currentStep, distToStepEnd, steps.length);

    // Mise a jour progression
    this.callbacks.onProgressUpdate?.({
      progress: progressFraction,
      currentStepIndex: this.currentStepIndex,
      totalSteps: steps.length,
      currentStep,
      distToStepEnd,
      userLat: displayLat,
      userLng: displayLng,
    });

    // Detection d'arrivee finale
    const isFinalStep = this.currentStepIndex === steps.length - 1;
    if (isFinalStep && (distToStepEnd <= this.options.arrivalThresholdMeters || progressFraction >= 0.995)) {
      this.handleArrival();
    }
  }

  /**
   * Projette (lat, lng) sur le segment [A, B] le plus proche de la polyligne.
   * Utilise une projection equirectangulaire locale en metres adaptee a Abidjan (~5.35° N).
   */
  private snapToRoute(lat: number, lng: number, coords: [number, number][]): SnapResult | null {
    if (!coords || coords.length < 2) return null;

    let bestDist = Infinity;
    let bestLat = coords[0][0];
    let bestLng = coords[0][1];
    let bestSegmentIndex = 0;
    let bestT = 0;
    let bestHeading = this.lastHeading;

    for (let i = 0; i < coords.length - 1; i++) {
      const [aLat, aLng] = coords[i];
      const [bLat, bLng] = coords[i + 1];

      const refLatRad = ((aLat + bLat) * 0.5 * Math.PI) / 180;
      const lngScale = METERS_PER_DEG_LAT * Math.cos(refLatRad);

      const bx = (bLng - aLng) * lngScale;
      const by = (bLat - aLat) * METERS_PER_DEG_LAT;
      const px = (lng - aLng) * lngScale;
      const py = (lat - aLat) * METERS_PER_DEG_LAT;

      const abSq = bx * bx + by * by;
      const t = abSq === 0 ? 0 : Math.max(0, Math.min(1, (px * bx + py * by) / abSq));

      const projLat = aLat + t * (bLat - aLat);
      const projLng = aLng + t * (bLng - aLng);
      const dist = haversineDistance(lat, lng, projLat, projLng);

      if (dist < bestDist) {
        bestDist = dist;
        bestLat = projLat;
        bestLng = projLng;
        bestSegmentIndex = i;
        bestT = t;
        if (abSq > 0) {
          bestHeading = calculateBearing(aLat, aLng, bLat, bLng);
        }
      }
    }

    this.lastHeading = bestHeading;

    const segStartDist = this.cumulativeDistances[bestSegmentIndex] ?? 0;
    const segEndDist = this.cumulativeDistances[bestSegmentIndex + 1] ?? segStartDist;
    const coveredDistance = segStartDist + bestT * (segEndDist - segStartDist);

    return {
      snappedLat: bestLat,
      snappedLng: bestLng,
      distanceMeters: bestDist,
      segmentIndex: bestSegmentIndex,
      t: bestT,
      heading: bestHeading,
      coveredDistance,
    };
  }

  // ---------------------------------------------------------------------------
  // 4 & 5. Detection de deviation (> 150m pendant > 30s) & Recalcul automatique
  // ---------------------------------------------------------------------------

  private evaluateDeviation(distanceToRouteMeters: number, rawLat: number, rawLng: number): void {
    const now = Date.now();

    if (distanceToRouteMeters > this.options.deviationThresholdMeters) {
      if (this.deviationStartTime === null) {
        this.deviationStartTime = now;
        return;
      }

      const elapsed = now - this.deviationStartTime;
      if (elapsed >= this.options.deviationDurationMs) {
        if (!this.deviationConfirmed) {
          this.deviationConfirmed = true;
          this.callbacks.onDeviation?.(Math.round(distanceToRouteMeters), rawLat, rawLng);
        }

        if (now - this.lastRerouteAt >= this.options.rerouteCooldownMs) {
          this.lastRerouteAt = now;
          this.callbacks.onReroute?.(rawLat, rawLng);
        }
      }
    } else {
      this.deviationStartTime = null;
      this.deviationConfirmed = false;
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Alertes de descente (300m & 80m) + Vibration + Synthese vocale FR
  // ---------------------------------------------------------------------------

  private checkDescenteAlerts(
    stepIndex: number,
    step: RouteStep,
    distToStepEnd: number,
    totalSteps: number
  ): void {
    const isFinal = stepIndex === totalSteps - 1;

    if (distToStepEnd <= this.options.alertFarMeters && !this.alerted300m.has(stepIndex)) {
      this.alerted300m.add(stepIndex);
      const message = isFinal
        ? `Dans 300 mètres, préparez-vous à descendre. Arrivée prochaine à ${step.toPlace.name}.`
        : `Dans 300 mètres, préparez-vous à descendre à ${step.toPlace.name} pour votre correspondance.`;

      this.triggerFeedback(message, [200, 100, 200]);
      this.callbacks.onAlertDescente?.({
        message,
        place: step.toPlace,
        isFinal,
        thresholdMeters: 300,
      });
    }

    if (distToStepEnd <= this.options.alertNearMeters && !this.alerted80m.has(stepIndex)) {
      this.alerted80m.add(stepIndex);
      const message = isFinal
        ? `Descendez maintenant ! Vous êtes arrivé à ${step.toPlace.name}.`
        : `Descendez maintenant à ${step.toPlace.name} pour la correspondance.`;

      this.triggerFeedback(message, [300, 100, 300, 100, 450]);
      this.callbacks.onAlertDescente?.({
        message,
        place: step.toPlace,
        isFinal,
        thresholdMeters: 80,
      });
    }
  }

  private triggerFeedback(message: string, vibrationPattern: number[]): void {
    if (this.options.enableVibration && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(vibrationPattern);
      } catch {
        // Ignore si bloque par la politique du navigateur
      }
    }

    if (this.options.enableVoice && typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "fr-FR";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Ignore les erreurs speechSynthesis
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Utilitaires geometriques internes
  // ---------------------------------------------------------------------------

  private resetProgressState(): void {
    this.currentStepIndex = 0;
    this.maxCoveredDistance = 0;
    this.simDistanceMeters = 0;
    this.lastHeading = 0;
    this.alerted300m.clear();
    this.alerted80m.clear();
    this.deviationStartTime = null;
    this.deviationConfirmed = false;
    this.lastRerouteAt = 0;
  }

  private precomputeRouteGeometry(route: Route): void {
    const coords = route.coordinates || [];
    this.cumulativeDistances = [0];

    for (let i = 1; i < coords.length; i++) {
      const segLen = haversineDistance(coords[i - 1][0], coords[i - 1][1], coords[i][0], coords[i][1]);
      this.cumulativeDistances.push(this.cumulativeDistances[i - 1] + segLen);
    }

    this.totalRouteDistance = this.cumulativeDistances[this.cumulativeDistances.length - 1] ?? 0;

    // Associer chaque etape a sa distance de fin cumulee sur la polyligne globale
    this.stepEndDistances = [];
    let searchStartVertex = 0;

    for (const step of route.steps) {
      let bestVertex = Math.min(searchStartVertex + 1, Math.max(0, coords.length - 1));
      let bestDist = Infinity;

      for (let v = searchStartVertex; v < coords.length; v++) {
        const d = haversineDistance(coords[v][0], coords[v][1], step.toPlace.lat, step.toPlace.lng);
        if (d < bestDist) {
          bestDist = d;
          bestVertex = v;
        }
        // Si on s'eloigne nettement apres avoir trouve un sommet tres proche (< 20m), on s'arrete
        if (bestDist < 20 && d > 100) break;
      }

      searchStartVertex = bestVertex;
      this.stepEndDistances.push(this.cumulativeDistances[bestVertex] ?? this.totalRouteDistance);
    }
  }

  private getCoordinatesAtDistance(distanceMeters: number): { lat: number; lng: number } | null {
    const coords = this.route?.coordinates;
    if (!coords || coords.length === 0) return null;
    if (coords.length === 1 || distanceMeters <= 0) {
      return { lat: coords[0][0], lng: coords[0][1] };
    }
    if (distanceMeters >= this.totalRouteDistance) {
      const last = coords[coords.length - 1];
      return { lat: last[0], lng: last[1] };
    }

    for (let i = 0; i < this.cumulativeDistances.length - 1; i++) {
      const startD = this.cumulativeDistances[i];
      const endD = this.cumulativeDistances[i + 1];
      if (distanceMeters >= startD && distanceMeters <= endD) {
        const segLen = endD - startD;
        const ratio = segLen > 0 ? (distanceMeters - startD) / segLen : 0;
        return {
          lat: coords[i][0] + (coords[i + 1][0] - coords[i][0]) * ratio,
          lng: coords[i][1] + (coords[i + 1][1] - coords[i][1]) * ratio,
        };
      }
    }

    const last = coords[coords.length - 1];
    return { lat: last[0], lng: last[1] };
  }

  private handleArrival(): void {
    const finishedRoute = this.route;
    this.stop();
    if (finishedRoute) {
      this.callbacks.onNavigationEnd?.(finishedRoute);
    }
  }
}
