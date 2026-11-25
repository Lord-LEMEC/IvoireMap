"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Place, Route } from "@/lib/types";

const ABIDJAN_CENTER: [number, number] = [5.36, -4.0083];

const MODE_COLORS: Record<string, string> = {
  gbaka: "#e8730c",
  waren: "#138a4a",
  sotra: "#2563eb",
  walk: "#64748b",
};

const CATEGORY_STYLE: Record<string, { color: string; glyph: string }> = {
  transport_hub: { color: "#e8730c", glyph: "🚐" },
  commercial: { color: "#138a4a", glyph: "🛒" },
  landmark: { color: "#d97706", glyph: "⭐" },
  culture: { color: "#d97706", glyph: "⭐" },
  health: { color: "#ef4444", glyph: "🏥" },
  education: { color: "#2563eb", glyph: "🎓" },
};

interface IvoireMapProps {
  places: Place[];
  activeRoute: Route | null;
  userPosition: { lat: number; lng: number; heading: number } | null;
  onSelectStart: (p: Place) => void;
  onSelectDestination: (p: Place) => void;
  flyToTarget: { lat: number; lng: number; zoom?: number } | null;
}

/**
 * Portage de l'ancien js/map.js (classe IvoireMapManager) en composant React.
 * Le DOM Leaflet est gere en imperatif dans des refs car Leaflet n'est pas reconcilie par React.
 */
export default function IvoireMap({
  places,
  activeRoute,
  userPosition,
  onSelectStart,
  onSelectDestination,
  flyToTarget,
}: IvoireMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const placesLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const userLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialisation unique de la carte
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: ABIDJAN_CENTER,
      zoom: 12,
      zoomControl: false,
      minZoom: 10,
      maxZoom: 18,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
      subdomains: "abc",
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributeurs | IvoireMap 🇨🇮',
    }).addTo(map);

    map.attributionControl.setPosition("bottomright");
    L.control.zoom({ position: "bottomright" }).addTo(map);

    placesLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    userLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Rendu des marqueurs de lieux
  useEffect(() => {
    const layer = placesLayerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.clearLayers();

    places.forEach((place) => {
      const style = CATEGORY_STYLE[place.category] || { color: "#475569", glyph: "📌" };

      const icon = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="background:${style.color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.35);border:2px solid white;">
            <span style="transform:rotate(-45deg);font-size:14px;">${style.glyph}</span>
          </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30],
      });

      const marker = L.marker([place.lat, place.lng], { icon });

      const aliasHtml = place.aliases?.[0] ? `<div style="font-style:italic;font-size:12px;opacity:.8;">« ${place.aliases[0]} »</div>` : "";
      marker.bindTooltip(
        `<strong>${place.name}</strong>${aliasHtml}<div style="font-size:11px;opacity:.7;">${place.commune}</div>`,
        { direction: "top", offset: [0, -30] }
      );

      const popupEl = document.createElement("div");
      popupEl.style.minWidth = "220px";
      popupEl.innerHTML = `
        <div style="font-weight:600;font-size:15px;margin-bottom:2px;">${place.name}</div>
        <div style="font-size:12px;opacity:.75;margin-bottom:6px;">${place.commune}${place.landmark ? " • " + place.landmark : ""}</div>
        <p style="font-size:13px;margin-bottom:10px;">${place.popularDescription ?? ""}</p>
        <div style="display:flex;gap:6px;">
          <button data-action="start" style="flex:1;background:#138a4a;color:white;border:none;border-radius:6px;padding:6px 8px;font-size:12px;cursor:pointer;">🟢 Partir d'ici</button>
          <button data-action="end" style="flex:1;background:#e8730c;color:white;border:none;border-radius:6px;padding:6px 8px;font-size:12px;cursor:pointer;">🟠 Aller ici</button>
        </div>
      `;
      popupEl.querySelector('[data-action="start"]')?.addEventListener("click", () => {
        onSelectStart(place);
        map.closePopup();
      });
      popupEl.querySelector('[data-action="end"]')?.addEventListener("click", () => {
        onSelectDestination(place);
        map.closePopup();
      });

      marker.bindPopup(popupEl, { maxWidth: 280 });
      marker.addTo(layer);
    });
  }, [places, onSelectStart, onSelectDestination]);

  // Trace de l'itineraire actif
  useEffect(() => {
    const layer = routeLayerRef.current;
    const map = mapRef.current;
    if (!layer || !map) return;
    layer.clearLayers();

    if (!activeRoute || activeRoute.steps.length === 0) return;

    const bounds = L.latLngBounds([]);

    activeRoute.steps.forEach((step) => {
      const color = MODE_COLORS[step.mode] || "#2563eb";
      const isWalk = step.mode === "walk";
      const line = L.polyline(step.coordinates, {
        color,
        weight: isWalk ? 5 : 7,
        opacity: isWalk ? 0.75 : 0.95,
        dashArray: isWalk ? "8,12" : undefined,
        lineCap: "round",
      });
      line.bindTooltip(`<strong>${step.line}</strong><br/>${step.duration} min • ${step.price} FCFA`, { sticky: true });
      line.addTo(layer);
      step.coordinates.forEach((pt) => bounds.extend(pt));
    });

    const first = activeRoute.steps[0];
    const last = activeRoute.steps[activeRoute.steps.length - 1];

    L.marker([first.fromPlace.lat, first.fromPlace.lng], {
      icon: L.divIcon({
        className: "",
        html: `<div style="background:#138a4a;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);">A</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
      zIndexOffset: 1000,
    }).addTo(layer);

    L.marker([last.toPlace.lat, last.toPlace.lng], {
      icon: L.divIcon({
        className: "",
        html: `<div style="background:#e8730c;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);">B</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
      zIndexOffset: 1000,
    }).addTo(layer);

    if (bounds.isValid()) {
      map.fitBounds(bounds, { paddingTopLeft: [40, 40], paddingBottomRight: [40, 220], maxZoom: 15 });
    }
  }, [activeRoute]);

  // Marqueur de position utilisateur (GPS ou simulation)
  useEffect(() => {
    const layer = userLayerRef.current;
    if (!layer) return;

    if (!userPosition) {
      if (userMarkerRef.current) {
        layer.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      return;
    }

    const icon = L.divIcon({
      className: "",
      html: `<div style="width:18px;height:18px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,.35);transform:rotate(${userPosition.heading}deg);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([userPosition.lat, userPosition.lng], { icon, zIndexOffset: 2000 }).addTo(layer);
    } else {
      userMarkerRef.current.setLatLng([userPosition.lat, userPosition.lng]);
      userMarkerRef.current.setIcon(icon);
    }
  }, [userPosition]);

  // Deplacement de la carte vers une cible (selection de lieu)
  useEffect(() => {
    if (!flyToTarget || !mapRef.current) return;
    mapRef.current.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom ?? 14, { duration: 1.1 });
  }, [flyToTarget]);

  return <div ref={containerRef} className="h-full w-full" />;
}
