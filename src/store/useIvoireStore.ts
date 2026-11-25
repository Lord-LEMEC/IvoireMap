"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PLACES, TRANSPORT_EDGES } from "@/lib/data";
import type { Place, TransportEdge, Route, NavigationProgress, DescenteAlert, FavoritePlace } from "@/lib/types";

interface IvoireState {
  // Reseau de transport (charge depuis Supabase avec fallback statique)
  places: Place[];
  edges: TransportEdge[];
  dataSource: "supabase" | "fallback";
  setNetwork: (places: Place[], edges: TransportEdge[], source: "supabase" | "fallback") => void;

  // Theme
  darkMode: boolean;
  toggleTheme: () => void;

  // Recherche / selection de lieux
  startPlace: Place | null;
  endPlace: Place | null;
  setStartPlace: (p: Place | null) => void;
  setEndPlace: (p: Place | null) => void;
  swapPlaces: () => void;
  clearSelection: () => void;

  // Itineraires calcules
  routes: Route[];
  activeRouteIndex: number;
  setRoutes: (routes: Route[]) => void;
  selectRoute: (index: number) => void;

  // Onglet actif (bas de page, equivalent mobile de l'ancien bottom-nav)
  activeTab: "map" | "routes" | "guide" | "favorites";
  setActiveTab: (tab: IvoireState["activeTab"]) => void;

  // Navigation / simulation en cours
  isNavigating: boolean;
  navProgress: NavigationProgress | null;
  descenteAlert: DescenteAlert | null;
  startNavigation: () => void;
  stopNavigation: () => void;
  setNavProgress: (p: NavigationProgress | null) => void;
  setDescenteAlert: (a: DescenteAlert | null) => void;

  // Favoris (persistes en local ; synchronisables avec Supabase plus tard)
  favorites: FavoritePlace[];
  addFavorite: (f: FavoritePlace) => void;
  removeFavorite: (placeId: string) => void;
}

export const useIvoireStore = create<IvoireState>()(
  persist(
    (set, get) => ({
      places: PLACES,
      edges: TRANSPORT_EDGES,
      dataSource: "fallback",
      setNetwork: (places, edges, dataSource) => set({ places, edges, dataSource }),

      darkMode: false,
      toggleTheme: () => set((s) => ({ darkMode: !s.darkMode })),

      startPlace: null,
      endPlace: null,
      setStartPlace: (p) => set({ startPlace: p }),
      setEndPlace: (p) => set({ endPlace: p }),
      swapPlaces: () =>
        set((s) => ({ startPlace: s.endPlace, endPlace: s.startPlace })),
      clearSelection: () =>
        set({ startPlace: null, endPlace: null, routes: [], activeRouteIndex: 0 }),

      routes: [],
      activeRouteIndex: 0,
      setRoutes: (routes) => set({ routes, activeRouteIndex: 0 }),
      selectRoute: (index) => set({ activeRouteIndex: index }),

      activeTab: "map",
      setActiveTab: (tab) => set({ activeTab: tab }),

      isNavigating: false,
      navProgress: null,
      descenteAlert: null,
      startNavigation: () => set({ isNavigating: true, descenteAlert: null }),
      stopNavigation: () => set({ isNavigating: false, navProgress: null, descenteAlert: null }),
      setNavProgress: (p) => set({ navProgress: p }),
      setDescenteAlert: (a) => set({ descenteAlert: a }),

      favorites: [],
      addFavorite: (f) =>
        set((s) => ({
          favorites: [...s.favorites.filter((fav) => fav.placeId !== f.placeId), f],
        })),
      removeFavorite: (placeId) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f.placeId !== placeId) })),
    }),
    {
      name: "ivoiremap-store",
      partialize: (s) => ({ darkMode: s.darkMode, favorites: s.favorites }),
    }
  )
);
