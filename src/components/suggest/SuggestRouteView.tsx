"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MessageSquarePlus, Send } from "lucide-react";
import { routeSuggestionSchema, type RouteSuggestionInput } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SuggestRouteView() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RouteSuggestionInput>({
    resolver: zodResolver(routeSuggestionSchema),
  });

  async function onSubmit(data: RouteSuggestionInput) {
    setSubmitError(null);
    const supabase = createClient();

    // Insertion dans la table dediee route_suggestions
    const { error } = await supabase.from("route_suggestions").insert({
      departure: data.departure.trim(),
      destination: data.destination.trim(),
      transport_modes: data.transportModes?.trim() || null,
      estimated_price: data.estimatedPrice?.trim() || null,
      process_description: data.processDescription.trim(),
      contact: data.contact?.trim() || null,
    });

    if (!error) {
      setSubmitted(true);
      reset();
      return;
    }

    // Fallback sur place_reports si la migration 0003 n'est pas encore appliquee
    const formattedMessage = [
      `Trajet manquant : ${data.departure} -> ${data.destination}`,
      data.transportModes ? `Transports : ${data.transportModes}` : null,
      data.estimatedPrice ? `Prix estime : ${data.estimatedPrice}` : null,
      `Processus : ${data.processDescription}`,
      data.contact ? `Contact : ${data.contact}` : null,
    ]
      .filter(Boolean)
      .join(" | ")
      .slice(0, 600);

    const { error: fallbackError } = await supabase.from("place_reports").insert({
      place_name: `${data.departure.trim()} -> ${data.destination.trim()}`,
      issue_type: "autre",
      message: formattedMessage,
    });

    if (fallbackError) {
      setSubmitError("Impossible d'envoyer votre message pour le moment. Verifiez votre connexion et reessayez.");
      return;
    }

    setSubmitted(true);
    reset();
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4 pb-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5 text-primary" />
          <h1 className="font-display text-xl font-bold">Proposer un trajet</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Votre trajet n&apos;est pas encore sur IvoireMap ? Envoyez un message a l&apos;administrateur en decrivant le
          processus pour y aller (arrets, Gbaka, Woro-woro, SOTRA, tarifs) afin qu&apos;il soit ajoute.
        </p>
      </div>

      {submitted ? (
        <div className="space-y-3 rounded-xl border border-border bg-card p-5 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-10 w-10 text-waren" />
          <h2 className="text-base font-semibold">Message envoye a l&apos;administrateur !</h2>
          <p className="text-sm text-muted-foreground">
            Merci pour votre contribution. Votre itineraire sera verifie et ajoute a IvoireMap.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Proposer un autre trajet
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="departure">Point de depart *</Label>
              <Input id="departure" placeholder="ex: Yopougon Siporex" {...register("departure")} />
              {errors.departure && <p className="text-xs text-destructive">{errors.departure.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="destination">Destination *</Label>
              <Input id="destination" placeholder="ex: Bingerville Marche" {...register("destination")} />
              {errors.destination && <p className="text-xs text-destructive">{errors.destination.message}</p>}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="transportModes">Moyens de transport</Label>
              <Input id="transportModes" placeholder="ex: Gbaka, Woro-woro, SOTRA 28" {...register("transportModes")} />
              {errors.transportModes && <p className="text-xs text-destructive">{errors.transportModes.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estimatedPrice">Tarif estime (FCFA)</Label>
              <Input id="estimatedPrice" placeholder="ex: 500 FCFA" {...register("estimatedPrice")} />
              {errors.estimatedPrice && <p className="text-xs text-destructive">{errors.estimatedPrice.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="processDescription">Processus pour y aller *</Label>
            <textarea
              id="processDescription"
              rows={5}
              placeholder="Decrivez etape par etape : quel gbaka ou woro-woro prendre, ou descendre pour la correspondance, les reperes et les prix approximatifs..."
              {...register("processDescription")}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.processDescription && <p className="text-xs text-destructive">{errors.processDescription.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact">Contact (optionnel)</Label>
            <Input id="contact" placeholder="Telephone ou email si besoin de precision" {...register("contact")} />
            {errors.contact && <p className="text-xs text-destructive">{errors.contact.message}</p>}
          </div>

          {submitError && <p className="text-xs text-destructive">{submitError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Envoi en cours..." : "Envoyer a l'administrateur"}
          </Button>
        </form>
      )}
    </div>
  );
}
