"use client";

import { Pause, Play, X, Gauge, Satellite, AlertTriangle, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavigationMode } from "@/lib/navigation";
import type { Route, NavigationProgress, DescenteAlert } from "@/lib/types";

interface NavigationHudProps {
  route: Route;
  mode?: NavigationMode;
  playing: boolean;
  speed: number;
  navProgress: NavigationProgress | null;
  descenteAlert?: DescenteAlert | null;
  deviationDistance?: number | null;
  arrived: boolean;
  onTogglePlay: () => void;
  onSetSpeed: (s: number) => void;
  onExit: () => void;
}

export function NavigationHud({
  route,
  mode = "gps",
  playing,
  speed,
  navProgress,
  descenteAlert,
  deviationDistance,
  arrived,
  onTogglePlay,
  onSetSpeed,
  onExit,
}: NavigationHudProps) {
  const step = navProgress?.currentStep ?? route.steps[0];
  const progressPct = Math.round((navProgress?.progress ?? 0) * 100);

  return (
    <div className="pointer-events-auto rounded-xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur">
      {arrived ? (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">🎉 Arrive a destination : {route.steps[route.steps.length - 1].toPlace.name} !</p>
          <Button size="sm" variant="outline" onClick={onExit}>
            Fermer
          </Button>
        </div>
      ) : (
        <>
          {deviationDistance !== null && deviationDistance !== undefined && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-amber-500/15 px-2.5 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Deviation detectee ({deviationDistance} m) — recalcul de l&apos;itineraire…</span>
            </div>
          )}

          {descenteAlert && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-primary/15 px-2.5 py-1.5 text-xs font-medium text-primary">
              <BellRing className="h-4 w-4 shrink-0" />
              <span>{descenteAlert.message}</span>
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="mb-0.5 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                  <Satellite className="h-3 w-3" />
                  {mode === "gps" ? "GPS" : "Simulation"}
                </span>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Vous etes dans : {step.line}
                </p>
              </div>
              <p className="text-sm font-medium">{step.instructions}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Prochaine descente : {step.toPlace.name} ({navProgress?.distToStepEnd ?? "—"} m)
              </p>
            </div>
            <button aria-label="Quitter la navigation" onClick={onExit} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="mt-3 flex items-center justify-between">
            {mode === "simulation" ? (
              <>
                <Button size="icon" variant="outline" onClick={onTogglePlay} aria-label={playing ? "Pause" : "Lecture"}>
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex items-center gap-1 text-xs">
                  <Gauge className="h-3.5 w-3.5" />
                  {[1, 2, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => onSetSpeed(s)}
                      className={cn("rounded px-1.5 py-0.5", speed === s ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Suivi GPS actif ({progressPct}%)
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Etape {(navProgress?.currentStepIndex ?? 0) + 1}/{navProgress?.totalSteps ?? route.steps.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
