import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getConnectionState, fetchInstance } from "@/lib/whatsapp/evolution-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const instanceName = request.nextUrl.searchParams.get("instance");
  if (!instanceName) {
    return Response.json({ ok: false, error: "instance obrigatório" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("agent_provisioning")
    .select("id, organization_id")
    .eq("evolution_instance_name", instanceName)
    .maybeSingle<{ id: string; organization_id: string | null }>();

  if (!row) return Response.json({ ok: false, error: "Instância não encontrada" }, { status: 404 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single<{ organization_id: string | null }>();

  if (!profile?.organization_id || profile.organization_id !== row.organization_id) {
    return new Response("Forbidden", { status: 403 });
  }

  let state: "open" | "close" | "connecting";
  try {
    const result = await getConnectionState(instanceName);
    state = result.instance.state;
  } catch (err) {
    console.error("[evolution/status] getConnectionState failed", err);
    return Response.json({ ok: false, error: "Falha ao consultar Evolution" }, { status: 502 });
  }

  let jid: string | null = null;
  if (state === "open") {
    try {
      const fetched = await fetchInstance(instanceName);
      jid = fetched?.instance.owner ?? null;
    } catch (err) {
      console.warn("[evolution/status] fetchInstance failed", err);
    }
  }

  await admin
    .from("agent_provisioning")
    .update({
      evolution_connection_state: state,
      ...(jid ? { evolution_jid: jid } : {}),
    })
    .eq("id", row.id);

  return Response.json({ ok: true, state, jid });
}
