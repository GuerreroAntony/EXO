import { type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteInstance } from "@/lib/whatsapp/evolution-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: drafts, error: selectError } = await admin
    .from("agent_provisioning")
    .select("id, evolution_instance_name")
    .eq("status", "draft")
    .lt("criado_em", cutoff);

  if (selectError) {
    console.error("[cron/cleanup-drafts] select failed", selectError);
    return Response.json({ ok: false, error: selectError.message }, { status: 500 });
  }

  let deletedRows = 0;
  let deletedInstances = 0;
  let instanceErrors = 0;

  for (const row of drafts ?? []) {
    if (row.evolution_instance_name) {
      try {
        await deleteInstance(row.evolution_instance_name);
        deletedInstances++;
      } catch (err) {
        console.warn("[cron/cleanup-drafts] deleteInstance failed", {
          instance: row.evolution_instance_name,
          err: String(err),
        });
        instanceErrors++;
      }
    }

    const { error: deleteError } = await admin
      .from("agent_provisioning")
      .delete()
      .eq("id", row.id);

    if (deleteError) {
      console.error("[cron/cleanup-drafts] row delete failed", { id: row.id, err: deleteError.message });
    } else {
      deletedRows++;
    }
  }

  return Response.json({
    ok: true,
    deletedRows,
    deletedInstances,
    instanceErrors,
    candidatesCount: drafts?.length ?? 0,
  });
}
