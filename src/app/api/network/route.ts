import { NextResponse } from "next/server";
import { fetchNetworkFromSupabase } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await fetchNetworkFromSupabase();
  return NextResponse.json(result);
}
