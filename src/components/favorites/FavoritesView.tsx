"use client";

import { useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { useIvoireStore } from "@/store/useIvoireStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchPlaces } from "@/lib/utils";
import type { Place } from "@/lib/types";

const SUGGESTED_LABELS = ["Domicile", "Travail", "Ecole"];

export function FavoritesView() {
  const { places, favorites, addFavorite, removeFavorite, setStartPlace, setEndPlace, setActiveTab } = useIvoireStore();
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState("Domicile");
  const matches = query ? searchPlaces(places, query) : [];

  function save(place: Place) {
    addFavorite({ placeId: place.id, label, createdAt: new Date().toISOString() });
    setQuery("");
  }

  function useAsDestination(placeId: string) {
    const place = places.find((p) => p.id === placeId);
    if (!place) return;
    setEndPlace(place);
    setActiveTab("map");
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      <h1 className="font-display text-xl font-bold">Mes favoris</h1>

      <div className="space-y-2 rounded-lg border border-border p-3">
        <div className="flex gap-2">
          {SUGGESTED_LABELS.map((l) => (
            <button
              key={l}
              onClick={() => setLabel(l)}
              className={`rounded-full border px-3 py-1 text-xs ${label === l ? "border-primary bg-primary/10" : "border-border"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <Input placeholder="Rechercher un lieu a ajouter..." value={query} onChange={(e) => setQuery(e.target.value)} />
        {matches.length > 0 && (
          <div className="max-h-48 space-y-1 overflow-auto">
            {matches.map((place) => (
              <button
                key={place.id}
                onClick={() => save(place)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                <span>{place.name}</span>
                <span className="text-xs text-muted-foreground">{place.commune}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {favorites.length === 0 && <p className="text-sm text-muted-foreground">Aucun favori enregistre pour le moment.</p>}
        {favorites.map((fav) => {
          const place = places.find((p) => p.id === fav.placeId);
          if (!place) return null;
          return (
            <div key={fav.placeId} className="flex items-center justify-between rounded-lg border border-border p-3">
              <button className="flex items-center gap-2 text-left" onClick={() => useAsDestination(fav.placeId)}>
                <Heart className="h-4 w-4 fill-primary text-primary" />
                <span>
                  <span className="block text-sm font-medium">{fav.label}</span>
                  <span className="block text-xs text-muted-foreground">{place.name}</span>
                </span>
              </button>
              <Button size="icon" variant="ghost" onClick={() => removeFavorite(fav.placeId)} aria-label="Supprimer">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
