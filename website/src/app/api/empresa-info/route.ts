import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clearPromptCache } from "@/lib/agents/prompt-builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CompanyInfo {
  nome_fantasia?: string;
  descricao?: string;
  endereco?: string;
  horario_funcionamento?: string;
  formas_pagamento?: string;
  politica_cancelamento?: string;
  faq?: string;
  escalonamento_humano?: string;
  restricoes?: string;
  contato_humano?: string;
  tom_marca?: string;
}

const FIELD_LABELS: Record<keyof CompanyInfo, string> = {
  nome_fantasia: "Nome fantasia",
  descricao: "O que a empresa faz / oferece",
  endereco: "Endereço",
  horario_funcionamento: "Horário de funcionamento",
  formas_pagamento: "Formas de pagamento aceitas",
  politica_cancelamento: "Política de cancelamento e reembolso",
  faq: "Perguntas frequentes",
  escalonamento_humano: "Quando chamar humano (escalonamento)",
  restricoes: "Restrições — o que o agente NUNCA deve fazer",
  contato_humano: "Contato humano de plantão",
  tom_marca: "Tom de voz e personalidade da marca",
};

function buildExtractedText(info: CompanyInfo): string {
  const lines: string[] = ["# Informações da empresa\n"];
  for (const key of Object.keys(FIELD_LABELS) as (keyof CompanyInfo)[]) {
    const value = info[key]?.trim();
    if (!value) continue;
    lines.push(`## ${FIELD_LABELS[key]}\n${value}\n`);
  }
  return lines.join("\n");
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle<{ organization_id: string | null }>();

  if (!profile?.organization_id) return Response.json({ info: null });

  const { data } = await supabase
    .from("knowledge_sources")
    .select("metadata")
    .eq("organization_id", profile.organization_id)
    .eq("kind", "company_info")
    .maybeSingle<{ metadata: CompanyInfo | null }>();

  return Response.json({ info: (data?.metadata as CompanyInfo | null) ?? null });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .maybeSingle<{ organization_id: string | null }>();

  if (!profile?.organization_id) return new Response("No organization", { status: 403 });

  const body = (await request.json().catch(() => null)) as CompanyInfo | null;
  if (!body) return new Response("Bad request", { status: 400 });

  const cleaned: CompanyInfo = {};
  for (const key of Object.keys(FIELD_LABELS) as (keyof CompanyInfo)[]) {
    const v = body[key]?.trim();
    if (v) cleaned[key] = v;
  }

  const extractedText = buildExtractedText(cleaned);

  const { data: existing } = await supabase
    .from("knowledge_sources")
    .select("id")
    .eq("organization_id", profile.organization_id)
    .eq("kind", "company_info")
    .maybeSingle<{ id: string }>();

  if (existing) {
    const { error } = await supabase
      .from("knowledge_sources")
      .update({
        title: "Informações da empresa",
        extracted_text: extractedText,
        metadata: cleaned,
        source_type: "structured",
      })
      .eq("id", existing.id);
    if (error) return new Response(error.message, { status: 500 });
  } else {
    const { error } = await supabase.from("knowledge_sources").insert({
      organization_id: profile.organization_id,
      title: "Informações da empresa",
      kind: "company_info",
      source_type: "structured",
      extracted_text: extractedText,
      metadata: cleaned,
    });
    if (error) return new Response(error.message, { status: 500 });
  }

  clearPromptCache();
  return Response.json({ ok: true, char_count: extractedText.length });
}
