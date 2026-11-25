/**
 * Types partages de l'application IvoireMap
 */

export type TransportModeId = "gbaka" | "waren" | "sotra" | "walk";

export interface TransportMode {
  id: TransportModeId;
  name: string;
  fullName: string;
  color: string;
  icon: string;
  badgeClass: string;
  tag: string;
  description: string;
}

export interface Place {
  id: string;
  name: string;
  aliases: string[];
  commune: string;
  category: string;
  categoryName: string;
  lat: number;
  lng: number;
  popularDescription?: string;
  landmark?: string;
}

export interface TransportEdge {
  id: string;
  from: string;
  to: string;
  bidirectional: boolean;
  mode: TransportModeId;
  duration: number; // minutes
  price: number; // FCFA
  line: string;
  instructions: string;
}

export interface TransportGuideSection {
  id: string;
  title: string;
  icon: string;
  color: string;
  content: string; // HTML (deja assaini a la source, cf. src/lib/sanitize.ts)
}

export interface TransportGuide {
  title: string;
  intro: string;
  sections: TransportGuideSection[];
}

/** Une etape individuelle d'un itineraire calcule */
export interface RouteStep {
  stepIndex: number;
  fromPlace: Place;
  toPlace: Place;
  mode: TransportModeId;
  duration: number;
  price: number;
  line: string;
  instructions: string;
  isTransfer: boolean;
  coordinates: [number, number][];
}

export type RouteType = "fastest" | "cheapest" | "simplest";

/** Un itineraire complet calcule par le routeur */
export interface Route {
  id: string;
  type: RouteType;
  title: string;
  subtitle: string;
  totalDuration: number;
  totalPrice: number;
  transfersCount: number;
  summary: string;
  steps: RouteStep[];
  coordinates: [number, number][];
}

export interface NavigationProgress {
  progress: number;
  currentStepIndex: number;
  totalSteps: number;
  currentStep: RouteStep;
  distToStepEnd: number;
  userLat: number;
  userLng: number;
}

export interface DescenteAlert {
  message: string;
  place: Place;
  isFinal: boolean;
}

/** Enregistrement de favori persiste (local ou Supabase) */
export interface FavoritePlace {
  placeId: string;
  label: string; // ex: "Domicile", "Travail", "Ecole"
  createdAt: string;
}

/** Signalement soumis par un contributeur */
export interface PlaceReport {
  placeId?: string;
  placeName: string;
  issueType: "ferme" | "deplace" | "mal_positionne" | "mal_nomme" | "prix_incorrect" | "autre";
  message: string;
}
