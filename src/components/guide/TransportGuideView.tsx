import { TRANSPORT_GUIDE, TRANSPORT_MODES } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Portage de la section "Guide des transports" (anciennement rendue via
 * ui.js#renderTransportGuide). Le contenu HTML provient d'un dataset interne
 * de confiance (data.ts), jamais d'une saisie utilisateur.
 */
export function TransportGuideView() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div>
        <h1 className="font-display text-xl font-bold">{TRANSPORT_GUIDE.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{TRANSPORT_GUIDE.intro}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.values(TRANSPORT_MODES).map((mode) => (
          <span
            key={mode.id}
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{ borderColor: mode.color + "55", color: mode.color, background: mode.color + "14" }}
          >
            {mode.name} • {mode.tag}
          </span>
        ))}
      </div>

      {TRANSPORT_GUIDE.sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle style={{ color: section.color }}>{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            {/* Contenu HTML statique issu de data.ts (aucune entree utilisateur) */}
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
