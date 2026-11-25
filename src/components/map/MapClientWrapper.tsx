"use client";

import dynamic from "next/dynamic";

// Leaflet acces `window` des l'import : le composant doit etre charge uniquement cote client.
const IvoireMap = dynamic(() => import("./IvoireMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
      Chargement de la carte...
    </div>
  ),
});

export default IvoireMap;
