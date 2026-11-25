"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IvoireNavigation, type DescenteAlertPayload, type NavigationMode } from "@/lib/navigation";
import type { NavigationProgress, Route } from "@/lib/types";

interface UseRouteNavigationOptions {
  onReroute?: (userLat: number, userLng: number) => void;
  onPanTo?: (lat: number, lng: number, zoom?: number) => void;
}

/**
 * Hook React pilotant IvoireNavigation (GPS watchPosition + map-matching +
 * fallback simulation + alertes 300m/80m + deviation/recalcul).
 */
export function useRouteSimulation(route: Route | null, options: UseRouteNavigationOptions = {}) {
  const [mode, setMode] = useState<NavigationMode>("gps");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [progress, setProgress] = useState(0);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number; heading: number } | null>(null);
  const [navProgress, setNavProgress] = useState<NavigationProgress | null>(null);
  const [descenteAlert, setDescenteAlert] = useState<DescenteAlertPayload | null>(null);
  const [deviationDistance, setDeviationDistance] = useState<number | null>(null);
  const [arrived, setArrived] = useState(false);

  const navRef = useRef<IvoireNavigation | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Instanciation unique du moteur de navigation
  useEffect(() => {
    const nav = new IvoireNavigation({
      onModeChange: (newMode) => {
        setMode(newMode);
        if (newMode === "simulation") {
          setPlaying(true);
        }
      },
      onUpdateUserLocation: (lat, lng, heading) => {
        setUserPosition({ lat, lng, heading });
      },
      onPanTo: (lat, lng, zoom) => {
        optionsRef.current.onPanTo?.(lat, lng, zoom);
      },
      onProgressUpdate: (p) => {
        setNavProgress(p);
        setProgress(p.progress);
        setDeviationDistance(null);
      },
      onAlertDescente: (alert) => {
        setDescenteAlert(alert);
      },
      onDeviation: (distanceMeters) => {
        setDeviationDistance(distanceMeters);
      },
      onReroute: (userLat, userLng) => {
        optionsRef.current.onReroute?.(userLat, userLng);
      },
      onNavigationEnd: () => {
        setArrived(true);
        setPlaying(false);
      },
    });

    navRef.current = nav;

    return () => {
      nav.stop();
      navRef.current = null;
    };
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setArrived(false);
    setDescenteAlert(null);
    setDeviationDistance(null);
    setNavProgress(null);
  }, []);

  const start = useCallback(
    (overrideRoute?: Route) => {
      const targetRoute = overrideRoute ?? route;
      if (!targetRoute || !navRef.current) return;
      reset();
      setPlaying(true);
      navRef.current.start(targetRoute);
    },
    [route, reset]
  );

  const stop = useCallback(() => {
    navRef.current?.stop();
    setPlaying(false);
    setUserPosition(null);
    setNavProgress(null);
    setDescenteAlert(null);
    setDeviationDistance(null);
  }, []);

  const updateRoute = useCallback((newRoute: Route) => {
    setDeviationDistance(null);
    setDescenteAlert(null);
    navRef.current?.updateRoute(newRoute);
  }, []);

  const setSpeed = useCallback((multiplier: number) => {
    setSpeedState(multiplier);
    navRef.current?.setSimulationSpeed(multiplier);
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying((prev) => {
      const next = !prev;
      navRef.current?.setSimulationPlaying(next);
      return next;
    });
  }, []);

  return {
    mode,
    playing,
    speed,
    progress,
    userPosition,
    navProgress,
    descenteAlert,
    deviationDistance,
    arrived,
    start,
    stop,
    updateRoute,
    setSpeed,
    togglePlay,
  };
}
