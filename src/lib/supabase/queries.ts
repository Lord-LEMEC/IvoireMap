import { PLACES, TRANSPORT_EDGES } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { Place, TransportEdge } from "@/lib/types";

export interface NetworkDataResult {
  places: Place[];
  edges: TransportEdge[];
  source: "supabase" | "fallback";
}

/**
 * Charge les lieux actifs et les aretes de transport depuis Supabase.
 * Bascule automatiquement sur le dataset statique (data.ts) si les tables
 * ne sont pas encore migrees/seedees ou si Supabase est inaccessible.
 */
export async function fetchNetworkFromSupabase(): Promise<NetworkDataResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { places: PLACES, edges: TRANSPORT_EDGES, source: "fallback" };
  }

  try {
    const supabase = createClient();

    const [{ data: placeRows, error: placesError }, { data: edgeRows, error: edgesError }] = await Promise.all([
      supabase
        .from("places")
        .select("id, name, aliases, commune, category, category_name, lat, lng, popular_description, landmark, status")
        .eq("status", "actif")
        .order("name"),
      supabase
        .from("transport_edges")
        .select("id, from_place, to_place, bidirectional, mode, duration_minutes, price_fcfa, line, instructions"),
    ]);

    if (placesError || edgesError || !placeRows || !edgeRows || placeRows.length === 0) {
      return { places: PLACES, edges: TRANSPORT_EDGES, source: "fallback" };
    }

    const places: Place[] = placeRows.map((row) => ({
      id: row.id,
      name: row.name,
      aliases: row.aliases ?? [],
      commune: row.commune,
      category: row.category,
      categoryName: row.category_name ?? row.category,
      lat: row.lat,
      lng: row.lng,
      popularDescription: row.popular_description ?? undefined,
      landmark: row.landmark ?? undefined,
    }));

    const edges: TransportEdge[] = edgeRows.map((row) => ({
      id: row.id,
      from: row.from_place,
      to: row.to_place,
      bidirectional: row.bidirectional,
      mode: row.mode,
      duration: row.duration_minutes,
      price: row.price_fcfa,
      line: row.line ?? "",
      instructions: row.instructions ?? "",
    }));

    return { places, edges, source: "supabase" };
  } catch {
    return { places: PLACES, edges: TRANSPORT_EDGES, source: "fallback" };
  }
}
