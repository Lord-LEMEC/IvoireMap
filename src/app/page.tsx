import { AppShell } from "@/components/AppShell";
import { fetchNetworkFromSupabase } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { places, edges, source } = await fetchNetworkFromSupabase();
  return <AppShell initialPlaces={places} initialEdges={edges} dataSource={source} />;
}
