"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { haversineDistance } from "@/lib/geo";
import { IvoireRouter } from "@/lib/router";
import { useIvoireStore } from "@/store/useIvoireStore";
import { useRouteSimulation } from "@/components/navigation/useRouteSimulation";
import IvoireMap from "@/components/map/MapClientWrapper";
import { SearchPanel } from "@/components/search/SearchPanel";
import { ReportPlaceDialog } from "@/components/search/ReportPlaceDialog";
import { RoutePanel } from "@/components/route/RoutePanel";
import { NavigationHud } from "@/components/navigation/NavigationHud";
import { TransportGuideView } from "@/components/guide/TransportGuideView";
import { FavoritesView } from "@/components/favorites/FavoritesView";
import { BottomNav } from "@/components/BottomNav";
import type { Place, TransportEdge } from "@/lib/types";

function findNearestPlace(places: Place[], lat: number, lng: number): Place | null {
  let nearest: Place | null = null;
  let minDist = Infinity;
  for (const place of places) {
    const d = haversineDistance(lat, lng, place.lat, place.lng);
    if (d < minDist) {
      minDist = d;
      nearest = place;
    }
  }
  return nearest;
}

interface AppShellProps {
  initialPlaces: Place[];
  initialEdges: TransportEdge[];
  dataSource: "supabase" | "fallback";
}

export function AppShell({ initialPlaces, initialEdges, dataSource }: AppShellProps) {
  const {
    places,
    edges,
    setNetwork,
    activeTab,
    endPlace,
    setStartPlace,
    setEndPlace,
    routes,
    activeRouteIndex,
    setRoutes,
    selectRoute,
    isNavigating,
    startNavigation: storeStartNav,
    stopNavigation,
    setNavProgress,
    setDescenteAlert,
    darkMode,
    toggleTheme,
  } = useIvoireStore();

  useEffect(() => {
    setNetwork(initialPlaces, initialEdges, dataSource);
  }, [initialPlaces, initialEdges, dataSource, setNetwork]);

  const navRouter = useMemo(() => new IvoireRouter(places, edges), [places, edges]);

  const activeRoute = routes[activeRouteIndex] ?? null;
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const lastPanAtRef = useRef(0);
  const updateRouteRef = useRef<(r: NonNullable<typeof activeRoute>) => void>(() => {});

  const handleReroute = useCallback(
    (userLat: number, userLng: number) => {
      const destination =
        activeRoute?.steps[activeRoute.steps.length - 1]?.toPlace ?? endPlace;
      if (!destination) return;

      const nearestStart = findNearestPlace(places, userLat, userLng);
      if (!nearestStart) return;

      const rerouted = navRouter.findRoutes(nearestStart.id, destination.id);
      if (rerouted.length === 0) return;

      const preferredType = activeRoute?.type;
      const matchIndex = preferredType
        ? rerouted.findIndex((r) => r.type === preferredType)
        : 0;
      const chosenIndex = matchIndex >= 0 ? matchIndex : 0;

      setStartPlace(nearestStart);
      setRoutes(rerouted);
      selectRoute(chosenIndex);
      updateRouteRef.current(rerouted[chosenIndex]);
    },
    [activeRoute, endPlace, navRouter, places, selectRoute, setRoutes, setStartPlace]
  );

  const handlePanTo = useCallback((lat: number, lng: number, zoom?: number) => {
    const now = Date.now();
    if (now - lastPanAtRef.current < 4000) return;
    lastPanAtRef.current = now;
    setFlyTo({ lat, lng, zoom: zoom ?? 16 });
  }, []);

  const sim = useRouteSimulation(isNavigating ? activeRoute : null, {
    onReroute: handleReroute,
    onPanTo: handlePanTo,
  });
  updateRouteRef.current = sim.updateRoute;

  // Synchronise le hook de simulation (local) avec le store global, pour que d'autres
  // composants (ex: carte) accedent a la progression/alerte sans prop-drilling profond.
  useEffect(() => {
    setNavProgress(sim.navProgress);
  }, [sim.navProgress, setNavProgress]);

  useEffect(() => {
    setDescenteAlert(sim.descenteAlert);
  }, [sim.descenteAlert, setDescenteAlert]);

  function handleStartNavigation() {
    storeStartNav();
    sim.start();
  }

  function handleExitNavigation() {
    stopNavigation();
    sim.stop();
  }

  function focusPlace(place: Place) {
    setFlyTo({ lat: place.lat, lng: place.lng, zoom: 14 });
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* En-tete */}
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇨🇮</span>
          <div>
            <p className="font-display text-sm font-bold leading-none">IvoireMap</p>
            <p className="text-[11px] leading-none text-muted-foreground">Naviguer comme un Ivoirien</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ReportPlaceDialog />
          <button
            onClick={toggleTheme}
            aria-label="Basculer le theme"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-muted"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Contenu principal selon l'onglet actif */}
      <main className="relative flex-1 overflow-hidden">
        {activeTab === "map" && (
          <div className="relative h-full w-full">
            <IvoireMap
              places={places}
              activeRoute={activeRoute}
              userPosition={isNavigating ? sim.userPosition : null}
              onSelectStart={(p) => {
                setStartPlace(p);
                focusPlace(p);
              }}
              onSelectDestination={(p) => {
                setEndPlace(p);
                focusPlace(p);
              }}
              flyToTarget={flyTo}
            />

            {!isNavigating && (
              <div className="pointer-events-none absolute left-0 right-0 top-3 z-[400] px-3">
                <div className="pointer-events-auto mx-auto max-w-md">
                  <SearchPanel onPlaceFocus={focusPlace} />
                </div>
              </div>
            )}

            {isNavigating && activeRoute && (
              <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-[400] px-3">
                <div className="pointer-events-auto mx-auto max-w-md">
                  <NavigationHud
                    route={activeRoute}
                    mode={sim.mode}
                    playing={sim.playing}
                    speed={sim.speed}
                    navProgress={sim.navProgress}
                    descenteAlert={sim.descenteAlert}
                    deviationDistance={sim.deviationDistance}
                    arrived={sim.arrived}
                    onTogglePlay={sim.togglePlay}
                    onSetSpeed={sim.setSpeed}
                    onExit={handleExitNavigation}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "routes" && (
          <div className="h-full">
            <RoutePanel onStartNavigation={handleStartNavigation} />
          </div>
        )}

        {activeTab === "guide" && (
          <div className="h-full overflow-y-auto">
            <TransportGuideView />
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="h-full overflow-y-auto">
            <FavoritesView />
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
