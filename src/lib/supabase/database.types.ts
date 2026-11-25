/**
 * Types generes manuellement a partir de supabase/migrations/0001_init.sql
 * (a remplacer par la sortie de `supabase gen types typescript` une fois le projet lie)
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "visiteur" | "utilisateur" | "contributeur_verifie" | "moderateur" | "administrateur";
          display_name: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      places: {
        Row: {
          id: string;
          name: string;
          aliases: string[];
          commune: string;
          category: string;
          category_name: string | null;
          lat: number;
          lng: number;
          popular_description: string | null;
          landmark: string | null;
          status: "actif" | "signale" | "ferme" | "en_attente";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["places"]["Row"]> & {
          name: string;
          commune: string;
          category: string;
          lat: number;
          lng: number;
        };
        Update: Partial<Database["public"]["Tables"]["places"]["Row"]>;
      };
      transport_edges: {
        Row: {
          id: string;
          from_place: string;
          to_place: string;
          bidirectional: boolean;
          mode: "gbaka" | "waren" | "sotra" | "walk";
          duration_minutes: number;
          price_fcfa: number;
          line: string | null;
          instructions: string | null;
          last_verified_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["transport_edges"]["Row"]> & {
          from_place: string;
          to_place: string;
          mode: "gbaka" | "waren" | "sotra" | "walk";
          duration_minutes: number;
          price_fcfa: number;
        };
        Update: Partial<Database["public"]["Tables"]["transport_edges"]["Row"]>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          place_id: string;
          label: string;
          created_at: string;
        };
        Insert: { user_id: string; place_id: string; label: string };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Row"]>;
      };
      place_reports: {
        Row: {
          id: string;
          place_id: string | null;
          place_name: string;
          issue_type: "ferme" | "deplace" | "mal_positionne" | "mal_nomme" | "prix_incorrect" | "autre";
          message: string;
          reported_by: string | null;
          status: "ouvert" | "en_cours" | "resolu" | "rejete";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["place_reports"]["Row"]> & {
          place_name: string;
          issue_type: "ferme" | "deplace" | "mal_positionne" | "mal_nomme" | "prix_incorrect" | "autre";
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["place_reports"]["Row"]>;
      };
      reviews: {
        Row: {
          id: string;
          place_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: { place_id: string; user_id: string; rating: number; comment?: string | null };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
      };
      route_suggestions: {
        Row: {
          id: string;
          departure: string;
          destination: string;
          transport_modes: string | null;
          estimated_price: string | null;
          process_description: string;
          contact: string | null;
          status: "nouveau" | "en_cours" | "ajoute" | "rejete";
          created_at: string;
        };
        Insert: {
          departure: string;
          destination: string;
          transport_modes?: string | null;
          estimated_price?: string | null;
          process_description: string;
          contact?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["route_suggestions"]["Row"]>;
      };
    };
  };
}
