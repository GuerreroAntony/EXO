import { createAdminClient } from "@/lib/supabase/admin";

const MAX_KB_CHARS = 100_000;

interface KnowledgeRow {
  title: string;
  extracted_text: string | null;
  agent_id: string | null;
}

const cache = new Map<string, { prompt: string; expiresAt: number }>();
const CACHE_TTL_MS = 60_000;

export async function buildSystemPromptWithKnowledge(
  agentId: string,
  organizationId: string,
  baseSystemPrompt: string,
): Promise<string> {
  const cacheKey = `${agentId}:${organizationId}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.prompt;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("knowledge_sources")
    .select("title, extracted_text, agent_id, kind")
    .eq("organization_id", organizationId)
    .or(`agent_id.is.null,agent_id.eq.${agentId}`)
    .order("kind", { ascending: false })
    .order("criado_em", { ascending: true });

  if (error) {
    console.error("[prompt-builder] failed to load knowledge", error.message);
    return baseSystemPrompt;
  }

  const sources = (data ?? []) as KnowledgeRow[];
  if (sources.length === 0) {
    cache.set(cacheKey, { prompt: baseSystemPrompt, expiresAt: Date.now() + CACHE_TTL_MS });
    return baseSystemPrompt;
  }

  let kbBlock = "\n\n## Base de conhecimento\n\nUse APENAS as informações abaixo como verdade sobre a empresa. Se a pergunta não for coberta aqui, diga que vai consultar com a equipe.\n\n";
  let totalChars = baseSystemPrompt.length + kbBlock.length;

  for (const source of sources) {
    if (!source.extracted_text) continue;
    const sectionHeader = `### ${source.title}${source.agent_id ? " (específico deste agente)" : ""}\n`;
    const section = sectionHeader + source.extracted_text + "\n\n---\n\n";
    if (totalChars + section.length > MAX_KB_CHARS) {
      kbBlock += "_(material adicional truncado por limite de contexto)_\n";
      break;
    }
    kbBlock += section;
    totalChars += section.length;
  }

  const fullPrompt = baseSystemPrompt + kbBlock;
  cache.set(cacheKey, { prompt: fullPrompt, expiresAt: Date.now() + CACHE_TTL_MS });
  return fullPrompt;
}

export function clearPromptCache(): void {
  cache.clear();
}
