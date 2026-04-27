import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clearPromptCache } from "@/lib/agents/prompt-builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/knowledge/[id]">) {
  const supabase = await createClient();
  const { id } = await ctx.params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { error } = await supabase.from("knowledge_sources").delete().eq("id", id);
  if (error) return new Response(error.message, { status: 500 });

  clearPromptCache();
  return Response.json({ ok: true });
}
