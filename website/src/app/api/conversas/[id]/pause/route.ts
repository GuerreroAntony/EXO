import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, ctx: RouteContext<"/api/conversas/[id]/pause">) {
  const supabase = await createClient();
  const { id: conversationId } = await ctx.params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { error } = await supabase
    .from("conversations")
    .update({ auto_reply: false })
    .eq("id", conversationId);

  if (error) return new Response(error.message, { status: 500 });
  return Response.json({ ok: true });
}
