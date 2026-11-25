"use client";

import { Map, Route, MessageSquarePlus } from "lucide-react";
import { useIvoireStore } from "@/store/useIvoireStore";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "map", label: "Carte", icon: Map },
  { id: "routes", label: "Itineraires", icon: Route },
  { id: "suggest", label: "Proposer", icon: MessageSquarePlus },
] as const;

export function BottomNav() {
  const { activeTab, setActiveTab } = useIvoireStore();

  return (
    <nav className="grid grid-cols-3 border-t border-border bg-background">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={cn(
            "flex flex-col items-center gap-0.5 py-2 text-xs transition-colors",
            activeTab === id ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </nav>
  );
}
