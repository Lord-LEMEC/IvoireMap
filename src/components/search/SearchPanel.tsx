"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, ArrowUpDown, LocateFixed, X } from "lucide-react";
import { searchPlaces } from "@/lib/utils";
import { routeSearchSchema, type RouteSearchInput } from "@/lib/validation";
import { useIvoireStore } from "@/store/useIvoireStore";
import { IvoireRouter } from "@/lib/router";
import type { Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchPanelProps {
  onPlaceFocus?: (place: Place) => void;
}

export function SearchPanel({ onPlaceFocus }: SearchPanelProps) {
  const { places, edges, startPlace, endPlace, setStartPlace, setEndPlace, swapPlaces, setRoutes, setActiveTab } =
    useIvoireStore();
  const router = useMemo(() => new IvoireRouter(places, edges), [places, edges]);
  const [startQuery, setStartQuery] = useState(startPlace?.name ?? "");
  const [endQuery, setEndQuery] = useState(endPlace?.name ?? "");
  const [focusField, setFocusField] = useState<"start" | "end" | null>(null);

  const { handleSubmit, setValue, formState } = useForm<RouteSearchInput>({
    resolver: zodResolver(routeSearchSchema),
    values: { startPlaceId: startPlace?.id ?? "", endPlaceId: endPlace?.id ?? "" },
  });

  const startMatches = useMemo(() => (focusField === "start" ? searchPlaces(places, startQuery) : []), [places, focusField, startQuery]);
  const endMatches = useMemo(() => (focusField === "end" ? searchPlaces(places, endQuery) : []), [places, focusField, endQuery]);

  function pickStart(place: Place) {
    setStartPlace(place);
    setStartQuery(place.name);
    setValue("startPlaceId", place.id);
    setFocusField(null);
    onPlaceFocus?.(place);
  }

  function pickEnd(place: Place) {
    setEndPlace(place);
    setEndQuery(place.name);
    setValue("endPlaceId", place.id);
    setFocusField(null);
    onPlaceFocus?.(place);
  }

  function triggerSearch() {
    if (!startPlace || !endPlace) return;
    const routes = router.findRoutes(startPlace.id, endPlace.id);
    setRoutes(routes);
    setActiveTab("routes");
  }

  function onSwap() {
    swapPlaces();
    const tmp = startQuery;
    setStartQuery(endQuery);
    setEndQuery(tmp);
  }

  return (
    <form
      onSubmit={handleSubmit(triggerSearch)}
      className="space-y-2 rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur"
    >
      <div className="relative flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[color:var(--tw-color-waren,#138a4a)] bg-waren" />
        <Input
          placeholder="Depart (ex: Siporex, Adjame Gare...)"
          value={startQuery}
          onFocus={() => setFocusField("start")}
          onChange={(e) => setStartQuery(e.target.value)}
        />
        {startQuery && (
          <button
            type="button"
            aria-label="Effacer le depart"
            className="absolute right-2 text-muted-foreground"
            onClick={() => {
              setStartQuery("");
              setStartPlace(null);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {focusField === "start" && startQuery && (
          <AutocompleteList matches={startMatches} onSelect={pickStart} />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 border-t border-dashed border-border" />
        <Button type="button" variant="ghost" size="icon" onClick={onSwap} aria-label="Inverser depart/destination">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
        <div className="flex-1 border-t border-dashed border-border" />
      </div>

      <div className="relative flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gbaka" />
        <Input
          placeholder="Destination (ex: Marche de Cocovico...)"
          value={endQuery}
          onFocus={() => setFocusField("end")}
          onChange={(e) => setEndQuery(e.target.value)}
        />
        {endQuery && (
          <button
            type="button"
            aria-label="Effacer la destination"
            className="absolute right-2 text-muted-foreground"
            onClick={() => {
              setEndQuery("");
              setEndPlace(null);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {focusField === "end" && endQuery && <AutocompleteList matches={endMatches} onSelect={pickEnd} />}
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" className="flex-1" onClick={() => locateMe(places, pickStart)}>
          <LocateFixed className="mr-1.5 h-4 w-4" /> Ma position
        </Button>
        <Button type="submit" className="flex-1" disabled={!startPlace || !endPlace}>
          Calculer l&apos;itineraire
        </Button>
      </div>
      {formState.errors.endPlaceId && (
        <p className="text-xs text-destructive">{formState.errors.endPlaceId.message}</p>
      )}
    </form>
  );
}

function AutocompleteList({ matches, onSelect }: { matches: Place[]; onSelect: (p: Place) => void }) {
  return (
    <div className="absolute left-0 top-full z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-background shadow-xl">
      {matches.length === 0 ? (
        <div className="p-3 text-xs text-muted-foreground">
          Aucun lieu trouve. Essayez un alias (ex: Siporex, Roxy, Anador...).
        </div>
      ) : (
        matches.map((place) => (
          <button
            type="button"
            key={place.id}
            onClick={() => onSelect(place)}
            className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-muted"
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block text-sm font-medium">
                {place.name}
                {place.aliases?.[0] && <span className="ml-1 text-xs italic text-muted-foreground">« {place.aliases[0]} »</span>}
              </span>
              <span className="block text-xs text-muted-foreground">
                {place.commune} {place.categoryName ? `• ${place.categoryName}` : ""}
              </span>
            </span>
          </button>
        ))
      )}
    </div>
  );
}

function locateMe(places: Place[], onFound: (p: Place) => void) {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    let closest: Place | null = null;
    let minDist = Infinity;
    places.forEach((p) => {
      const d = (p.lat - latitude) ** 2 + (p.lng - longitude) ** 2;
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    });
    if (closest) onFound(closest);
  });
}
