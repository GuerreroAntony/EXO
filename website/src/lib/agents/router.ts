import { createAdminClient } from "@/lib/supabase/admin";

export interface RoutedAgent {
  id: string;
  organization_id: string;
  agent_name: string;
  agent_type: string;
  system_prompt: string | null;
  status: string;
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { agent: RoutedAgent | null; expiresAt: number }>();

export async function findAgentByPhoneNumberId(phoneNumberId: string): Promise<RoutedAgent | null> {
  const cached = cache.get(phoneNumberId);
  if (cached && cached.expiresAt > Date.now()) return cached.agent;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("agent_provisioning")
    .select("id, organization_id, agent_name, agent_type, system_prompt, status")
    .eq("whatsapp_phone_number_id", phoneNumberId)
    .eq("status", "active")
    .maybeSingle<RoutedAgent>();

  if (error) {
    console.error("[agents/router] lookup failed", { phoneNumberId, error: error.message });
    return null;
  }

  cache.set(phoneNumberId, { agent: data ?? null, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}

export function clearAgentCache(): void {
  cache.clear();
}
