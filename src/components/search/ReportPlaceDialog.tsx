"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { placeReportSchema, type PlaceReportInput } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

const ISSUE_LABELS: Record<PlaceReportInput["issueType"], string> = {
  ferme: "Lieu ferme",
  deplace: "Lieu deplace",
  mal_positionne: "Mal positionne sur la carte",
  mal_nomme: "Mal nomme / alias manquant",
  prix_incorrect: "Prix incorrect",
  autre: "Autre",
};

export function ReportPlaceDialog() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlaceReportInput>({ resolver: zodResolver(placeReportSchema) });

  async function onSubmit(data: PlaceReportInput) {
    const supabase = createClient();
    const { error } = await supabase.from("place_reports").insert({
      place_name: data.placeName,
      issue_type: data.issueType,
      message: data.message,
    });
    if (!error) {
      setSubmitted(true);
      reset();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSubmitted(false);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Signaler un lieu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler un lieu manquant ou une erreur</DialogTitle>
          <DialogDescription>
            Aidez la communaute a garder IvoireMap a jour : lieu ferme, deplace, mal nomme ou prix incorrect.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <p className="text-sm text-waren">Merci ! Votre signalement a ete envoye a la moderation.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Label htmlFor="placeName">Nom du lieu</Label>
              <Input id="placeName" {...register("placeName")} placeholder="ex: Carrefour Siporex" />
              {errors.placeName && <p className="text-xs text-destructive">{errors.placeName.message}</p>}
            </div>

            <div>
              <Label htmlFor="issueType">Type de probleme</Label>
              <select
                id="issueType"
                {...register("issueType")}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="">Selectionner...</option>
                {Object.entries(ISSUE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.issueType && <p className="text-xs text-destructive">{errors.issueType.message}</p>}
            </div>

            <div>
              <Label htmlFor="message">Description</Label>
              <textarea
                id="message"
                {...register("message")}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Decrivez le probleme rencontre..."
              />
              {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Envoyer le signalement"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
