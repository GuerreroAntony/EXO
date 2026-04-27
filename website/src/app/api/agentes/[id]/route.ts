import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clearAgentCache } from "@/lib/agents/router";
import { clearPromptCache } from "@/lib/agents/prompt-builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AgentPatch {
  agent_name?: string;
  agent_type?: string;
  tone?: string;
  status?: string;
  system_prompt?: string;
}

const ALLOWED_TYPES = ["recepcionista", "sac", "cobranca", "agendamento", "custom"];
const ALLOWED_TONES = ["amigavel", "profissional", "formal"];
const ALLOWED_STATUSES = ["pending", "provisioning", "active", "error"];

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/agentes/[id]">) {
  const supabase = await createClient();
  const { id: agentId } = await ctx.params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = (await request.json().catch(() => null)) as AgentPatch | null;
  if (!body) return new Response("Bad request", { status: 400 });

  const update: Record<string, unknown> = { atualizado_em: new Date().toISOString() };

  if (body.agent_name !== undefined) {
    const name = body.agent_name.trim();
    if (!name) return new Response("agent_name cannot be empty", { status: 400 });
    update.agent_name = name;
  }
  if (body.agent_type !== undefined) {
    if (!ALLOWED_TYPES.includes(body.agent_type)) return new Response("invalid agent_type", { status: 400 });
    update.agent_type = body.agent_type;
  }
  if (body.tone !== undefined) {
    if (!ALLOWED_TONES.includes(body.tone)) return new Response("invalid tone", { status: 400 });
    update.tone = body.tone;
  }
  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) return new Response("invalid status", { status: 400 });
    update.status = body.status;
  }
  if (body.system_prompt !== undefined) {
    update.system_prompt = body.system_prompt;
  }

  const { error } = await supabase
    .from("agent_provisioning")
    .update(update)
    .eq("id", agentId);

  if (error) return new Response(error.message, { status: 500 });

  clearAgentCache();
  clearPromptCache();
  return Response.json({ ok: true });
}
