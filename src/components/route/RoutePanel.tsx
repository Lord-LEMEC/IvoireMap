"use client";

import { useIvoireStore } from "@/store/useIvoireStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Footprints, Navigation2, Play } from "lucide-react";
import type { RouteType } from "@/lib/types";

const TYPE_ICON: Record<RouteType, string> = { fastest: "🚀", cheapest: "💰", simplest: "🎯" };

const MODE_LABEL: Record<string, string> = {
  gbaka: "Gbaka",
  waren: "Wôrô-wôrô",
  sotra: "Bus SOTRA",
  walk: "Marche",
};

const MODE_CLASS: Record<string, string> = {
  gbaka: "bg-gbaka/10 text-gbaka border-gbaka/30",
  waren: "bg-waren/10 text-waren border-waren/30",
  sotra: "bg-sotra/10 text-sotra border-sotra/30",
  walk: "bg-walk/10 text-walk border-walk/30",
};

interface RoutePanelProps {
  onStartNavigation?: () => void;
}

export function RoutePanel({ onStartNavigation }: RoutePanelProps = {}) {
  const { routes, activeRouteIndex, selectRoute, clearSelection } = useIvoireStore();

  if (routes.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
        <Navigation2 className="h-8 w-8 opacity-40" />
        <p className="text-sm">Choisissez un depart et une destination pour voir les itineraires.</p>
      </div>
    );
  }

  const activeRoute = routes[activeRouteIndex];

  return (
    <div className="flex h-full flex-col">
      {/* Onglets de variantes */}
      <div className="flex gap-2 overflow-x-auto border-b border-border p-2">
        {routes.map((route, i) => (
          <button
            key={route.id}
            onClick={() => selectRoute(i)}
            className={cn(
              "flex min-w-[130px] flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors",
              i === activeRouteIndex ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
            )}
          >
            <span className="text-xs font-medium">
              {TYPE_ICON[route.type]} {route.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {route.totalDuration} min • {route.totalPrice} F
            </span>
          </button>
        ))}
      </div>

      {/* Fiche detaillee de la route active */}
      <div className="flex-1 overflow-y-auto p-3">
        <Card className="mb-3">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-base font-semibold">{activeRoute.title}</h2>
              <p className="text-xs text-muted-foreground">{activeRoute.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">{activeRoute.totalPrice} F</div>
              <div className="text-xs text-muted-foreground">FCFA</div>
            </div>
          </CardContent>
          <CardContent className="grid grid-cols-3 gap-2 border-t border-border pt-3">
            <Stat label="Duree" value={`⏱️ ${activeRoute.totalDuration} min`} />
            <Stat label="Correspondances" value={activeRoute.transfersCount === 0 ? "Direct" : String(activeRoute.transfersCount)} />
            <Stat label="Modes" value={activeRoute.summary.split("-")[0].trim()} />
          </CardContent>
        </Card>

        <ol className="space-y-3">
          {activeRoute.steps.map((step) => (
            <li key={step.stepIndex} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm",
                    MODE_CLASS[step.mode]
                  )}
                >
                  {step.mode === "walk" ? <Footprints className="h-4 w-4" /> : MODE_LABEL[step.mode][0]}
                </span>
                {step.stepIndex !== activeRoute.steps.length && <span className="my-1 h-full w-px flex-1 bg-border" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{MODE_LABEL[step.mode]}</span>
                  <span className="text-xs text-muted-foreground">
                    {step.duration} min {step.price > 0 && `• ${step.price} F`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{step.line}</p>
                <p className="mt-1 text-sm">{step.instructions}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-2 border-t border-border p-3">
        <Button variant="outline" className="flex-1" onClick={clearSelection}>
          Nouvelle recherche
        </Button>
        <Button className="flex-1" onClick={onStartNavigation}>
          <Play className="mr-1.5 h-4 w-4" /> Demarrer la navigation
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
