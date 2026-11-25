import { z } from "zod";

/** Formulaire de recherche d'itineraire (depart / arrivee) */
export const routeSearchSchema = z
  .object({
    startPlaceId: z.string().min(1, "Choisissez un lieu de depart"),
    endPlaceId: z.string().min(1, "Choisissez une destination"),
  })
  .refine((data) => data.startPlaceId !== data.endPlaceId, {
    message: "Le depart et la destination doivent etre differents",
    path: ["endPlaceId"],
  });

export type RouteSearchInput = z.infer<typeof routeSearchSchema>;

/** Formulaire "Signaler un lieu" */
export const placeReportSchema = z.object({
  placeId: z.string().optional(),
  placeName: z.string().min(2, "Indiquez le nom du lieu concerne"),
  issueType: z.enum(["ferme", "deplace", "mal_positionne", "mal_nomme", "prix_incorrect", "autre"], {
    required_error: "Selectionnez un type de probleme",
  }),
  message: z
    .string()
    .min(10, "Decrivez le probleme en quelques mots (10 caracteres minimum)")
    .max(600, "Message trop long (600 caracteres maximum)"),
});

export type PlaceReportInput = z.infer<typeof placeReportSchema>;

/** Formulaire de contribution communautaire (nouveau lieu / arret / repere) */
export const contributionSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  commune: z.string().min(2, "La commune est requise"),
  category: z.string().min(1, "Choisissez une categorie"),
  aliases: z.string().optional(), // liste separee par des virgules, transformee cote formulaire
  landmark: z.string().optional(),
  lat: z.coerce.number().gte(4.0).lte(11.5, "Latitude hors de Cote d'Ivoire"),
  lng: z.coerce.number().gte(-9).lte(-2.0, "Longitude hors de Cote d'Ivoire"),
});

export type ContributionInput = z.infer<typeof contributionSchema>;

/** Inscription / connexion (email) */
export const authSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "8 caracteres minimum"),
});

export type AuthInput = z.infer<typeof authSchema>;
