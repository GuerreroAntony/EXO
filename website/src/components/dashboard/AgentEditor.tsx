"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Agent {
  id: string;
  agent_name: string;
  agent_type: string;
  tone: string | null;
  status: string;
  system_prompt: string | null;
  whatsapp_phone_number_id: string | null;
  whatsapp_display_name: string | null;
}

const AGENT_TYPES = [
  { value: "recepcionista", label: "Recepção" },
  { value: "sac", label: "SAC" },
  { value: "cobranca", label: "Cobrança" },
  { value: "agendamento", label: "Agendamento" },
  { value: "custom", label: "Customizado" },
];

const TONES = [
  { value: "amigavel", label: "Amigável" },
  { value: "profissional", label: "Profissional" },
  { value: "formal", label: "Formal" },
];

const STATUSES = [
  { value: "active", label: "Ativo (responde no WhatsApp)" },
  { value: "pending", label: "Pausado (não responde)" },
  { value: "error", label: "Erro" },
];

export default function AgentEditor({ agentId }: { agentId: string }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchAgent = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("agent_provisioning")
      .select("id, agent_name, agent_type, tone, status, system_prompt, whatsapp_phone_number_id, whatsapp_display_name")
      .eq("id", agentId)
      .maybeSingle<Agent>();
    setAgent(data);
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);

  async function handleSave() {
    if (!agent || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/agentes/${agentId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          agent_name: agent.agent_name,
          agent_type: agent.agent_type,
          tone: agent.tone,
          status: agent.status,
          system_prompt: agent.system_prompt,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-[#666] text-sm">Carregando agente...</div>;
  }
  if (!agent) {
    return <div className="text-[#888] text-sm">Agente não encontrado</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/agentes" className="text-[#666] hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Editar agente</h1>
          <p className="text-sm text-[#999] mt-0.5">{agent.agent_name}</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
        <Field label="Nome do agente" hint="Nome que ele usa nas conversas (ex: 'Sofia', 'Léo').">
          <input
            type="text"
            value={agent.agent_name}
            onChange={(e) => setAgent({ ...agent, agent_name: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444]"
          />
        </Field>

        <Field label="Tipo">
          <select
            value={agent.agent_type}
            onChange={(e) => setAgent({ ...agent, agent_type: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444]"
          >
            {AGENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Tom">
          <select
            value={agent.tone ?? "amigavel"}
            onChange={(e) => setAgent({ ...agent, tone: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444]"
          >
            {TONES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            value={agent.status}
            onChange={(e) => setAgent({ ...agent, status: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444]"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>

        <Field
          label="Prompt do sistema"
          hint="Define a personalidade, regras e contexto do agente. A base de conhecimento é injetada automaticamente abaixo deste texto na hora de responder."
        >
          <textarea
            value={agent.system_prompt ?? ""}
            onChange={(e) => setAgent({ ...agent, system_prompt: e.target.value })}
            rows={18}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-[#444] resize-y"
          />
          <p className="text-[11px] text-[#555] mt-1">{(agent.system_prompt ?? "").length} caracteres</p>
        </Field>

        {agent.whatsapp_phone_number_id && (
          <Field label="WhatsApp conectado" hint="Por enquanto edição via SQL. UI multi-tenant vem depois do Access Verification da Meta.">
            <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm">
              <MessageCircle size={14} className="text-emerald-400" />
              <span className="text-[#888] font-mono text-xs">{agent.whatsapp_phone_number_id}</span>
              {agent.whatsapp_display_name && (
                <span className="text-[#666]">· {agent.whatsapp_display_name}</span>
              )}
            </div>
          </Field>
        )}

        {error && (
          <div className="flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
            <CheckCircle2 size={14} />
            <span>Salvo. Mudanças aplicadas em até 60s nas próximas mensagens.</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#1e1e1e] disabled:text-[#555] text-white text-sm font-medium rounded-xl transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-white font-medium mb-1.5">{label}</label>
      {hint && <p className="text-xs text-[#666] mb-2">{hint}</p>}
      {children}
    </div>
  );
}
