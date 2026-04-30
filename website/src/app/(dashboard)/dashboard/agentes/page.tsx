"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Plus,
  Headphones,
  DollarSign,
  Calendar,
  ExternalLink,
  Pencil,
  Bot,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/supabase/use-org";

interface Agent {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  canais: string[];
  descricao: string;
  atendimentos_count: number;
  criado_em: string;
  [key: string]: unknown;
}

interface ProvisionedAgent {
  id: string;
  organization_id: string;
  agent_name: string;
  agent_type: string;
  capabilities: string[] | null;
  status: string;
  phone_number: string | null;
  voice_name: string | null;
  tone: string | null;
  vapi_assistant_id: string | null;
  twilio_phone_sid: string | null;
  whatsapp_phone_number_id: string | null;
  whatsapp_display_name: string | null;
  whatsapp_phone_number: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

const typeIcons: Record<string, typeof Phone> = {
  recepcionista: Phone,
  sac: Headphones,
  cobranca: DollarSign,
  agendamento: Calendar,
  custom: Bot,
};

const typeColors: Record<string, string> = {
  recepcionista: "text-violet-400 bg-violet-500/15",
  sac: "text-blue-400 bg-blue-500/15",
  cobranca: "text-amber-400 bg-amber-500/15",
  agendamento: "text-emerald-400 bg-emerald-500/15",
  custom: "text-pink-400 bg-pink-500/15",
};

const typeLabels: Record<string, string> = {
  recepcionista: "Recepção",
  sac: "SAC",
  cobranca: "Cobrança",
  agendamento: "Agendamento",
  custom: "Multi",
};

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) {
    const ddd = digits.slice(2, 4);
    const num = digits.slice(4);
    return `+55 (${ddd}) ${num.slice(0, num.length - 4)}-${num.slice(num.length - 4)}`;
  }
  return phone;
}

function StatusDot({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "provisionando") {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
      </span>
    );
  }
  const colors: Record<string, string> = {
    ativo: "bg-emerald-500",
    pendente: "bg-yellow-500",
    erro: "bg-red-500",
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${colors[s] ?? "bg-[#444]"}`} />;
}

export default function AgentesPage() {
  const { orgId, loading: orgLoading } = useOrg();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [provisioned, setProvisioned] = useState<ProvisionedAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgLoading) return;
    if (!orgId) { setLoading(false); return; }
    const supabase = createClient();
    Promise.all([
      supabase.from("agents").select("*").eq("organization_id", orgId).order("criado_em"),
      supabase.from("agent_provisioning").select("*").eq("organization_id", orgId).neq("status", "draft").order("criado_em", { ascending: false }),
    ]).then(([legacyRes, provRes]) => {
      setAgents(legacyRes.data ?? []);
      setProvisioned(provRes.data ?? []);
      setLoading(false);
    });
  }, [orgId, orgLoading]);

  const hasAny = agents.length > 0 || provisioned.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Agentes"
        subtitle="Gerencie seus agentes de IA"
        action={
          <Link
            href="/dashboard/agentes/novo"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={16} />
            Novo Agente
          </Link>
        }
      />

      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-[#333] border-t-[#666] rounded-full animate-spin mx-auto" />
        </div>
      ) : !hasAny ? (
        <div className="text-center py-20">
          <Headphones className="w-10 h-10 text-[#333] mx-auto mb-4" />
          <p className="text-[#888]">Nenhum agente configurado</p>
          <p className="text-sm text-[#999] mt-1">
            Os dados aparecerão aqui quando houver atividade.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Provisioned agents */}
          {provisioned.map((agent, i) => {
            const Icon = typeIcons[agent.agent_type] ?? Bot;
            const colorClass =
              typeColors[agent.agent_type] ?? "text-[#999] bg-[#1a1a1a]";

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-[#151515] border border-[#333] rounded-2xl p-5 hover:bg-[#1a1a1a] hover:border-[#2a2a2a] transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-[15px] font-semibold text-white truncate">
                        {agent.agent_name}
                      </h3>
                      <StatusDot status={agent.status} />
                    </div>
                    <p className="text-[11px] font-mono text-[#888] uppercase tracking-wider">
                      {typeLabels[agent.agent_type] ?? agent.agent_type}
                    </p>
                  </div>
                </div>

                {/* Capabilities chips for multi-capability agents */}
                {agent.agent_type === "custom" && agent.capabilities && agent.capabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {agent.capabilities.map((cap) => {
                      const CapIcon = typeIcons[cap] ?? Bot;
                      const capColor = typeColors[cap] ?? "text-[#999] bg-[#1a1a1a]";
                      return (
                        <span key={cap} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${capColor}`}>
                          <CapIcon size={11} />
                          {typeLabels[cap] ?? cap}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Status badge */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <StatusBadge status={agent.status} />
                  {agent.tone && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-[#1e1e1e] text-[#888]">
                      {agent.tone}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {agent.whatsapp_phone_number_id && (
                    <div className="flex items-start gap-2 text-sm">
                      <MessageCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-[#888]">
                          WhatsApp{agent.whatsapp_display_name ? ` · ${agent.whatsapp_display_name}` : ""}
                        </p>
                        {agent.whatsapp_phone_number && (
                          <p className="text-[12px] font-mono text-[#666]">
                            {agent.whatsapp_phone_number}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {agent.phone_number && (
                    <div className="flex items-center gap-2 text-sm text-[#666]">
                      <span className="text-base leading-none">🇧🇷</span>
                      <span className="font-mono text-[13px]">
                        {formatPhone(agent.phone_number)}
                      </span>
                    </div>
                  )}
                  {agent.voice_name && (
                    <p className="text-[13px] text-[#888]">
                      Voz: <span className="text-[#666]">{agent.voice_name}</span>
                    </p>
                  )}
                  {agent.vapi_assistant_id && (
                    <p className="text-[11px] font-mono text-[#444] truncate">
                      {agent.vapi_assistant_id}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#333]">
                  {agent.vapi_assistant_id && (
                    <a
                      href={`https://vapi.ai/assistant/${agent.vapi_assistant_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#5B9BF3] bg-[#5B9BF3]/10 rounded-lg hover:bg-[#5B9BF3]/20 transition-colors"
                    >
                      <ExternalLink size={12} />
                      Testar
                    </a>
                  )}
                  <Link
                    href={`/dashboard/agentes/${agent.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#888] bg-[#151515] border border-[#333] rounded-lg hover:bg-[#1e1e1e] transition-colors"
                  >
                    <Pencil size={12} />
                    Editar
                  </Link>
                </div>
              </motion.div>
            );
          })}

          {/* Legacy agents */}
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id ?? agent.nome}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: (provisioned.length + i) * 0.08,
              }}
              className="bg-[#151515] border border-[#333] rounded-2xl p-5 hover:bg-[#1a1a1a] hover:border-[#2a2a2a] transition-all duration-300"
            >
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#5B9BF3]/10 flex items-center justify-center shrink-0">
                  <Headphones size={20} className="text-[#5B9BF3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-[15px] font-semibold text-white truncate">
                      {agent.nome}
                    </h3>
                    <StatusBadge status={agent.status} />
                  </div>
                  <p className="text-[11px] font-mono text-[#888] uppercase tracking-wider">
                    {agent.tipo}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#999] mb-4">{agent.descricao}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(agent.canais ?? []).map((ch) => (
                    <span
                      key={ch}
                      className="flex items-center gap-1 text-[11px] text-[#888] bg-[#151515] border border-[#333] rounded-lg px-2.5 py-1"
                    >
                      {ch === "Voz" ? (
                        <Phone size={12} />
                      ) : (
                        <MessageCircle size={12} />
                      )}
                      {ch}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#999]">
                  {agent.atendimentos_count ?? 0} atendimentos
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
