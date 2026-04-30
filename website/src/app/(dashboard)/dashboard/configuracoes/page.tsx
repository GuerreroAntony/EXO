"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Phone, MessageCircle, Zap, Calendar as CalendarIcon } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import CompanyInfoForm from "@/components/dashboard/CompanyInfoForm";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/supabase/use-org";

function InputField({ label, value, onChange, readOnly = false }: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] font-mono text-[#888] uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-[#151515] border border-[#333] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#999] focus:outline-none focus:border-[#5B9BF3]/50 transition-colors ${readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#151515] border border-[#333] rounded-2xl p-6 ">
      <h3 className="text-base font-semibold text-white mb-5">{title}</h3>
      {children}
    </div>
  );
}

const tabs = [
  { id: "perfil", label: "Perfil" },
  { id: "empresa", label: "Empresa" },
  { id: "canais", label: "Canais" },
  { id: "integracoes", label: "Integrações" },
];

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function ConfiguracoesPage() {
  const { orgId, orgName, userName } = useOrg();
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("perfil");
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [setor, setSetor] = useState("");
  const [endereco, setEndereco] = useState("");

  interface ConnectedAgent {
    id: string;
    agent_name: string;
    transport: "meta" | "evolution";
    phone_label: string;
    display_name: string | null;
    state: "open" | "close" | "connecting" | "active";
  }

  const [connectedAgents, setConnectedAgents] = useState<ConnectedAgent[]>([]);

  useEffect(() => {
    setNome(userName);
    setEmpresa(orgName);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
    });
  }, [userName, orgName, orgId]);

  useEffect(() => {
    if (!orgId) return;
    const supabase = createClient();
    supabase
      .from("agent_provisioning")
      .select("id, agent_name, transport, status, whatsapp_display_name, whatsapp_phone_number, whatsapp_phone_number_id, evolution_jid, evolution_connection_state")
      .eq("organization_id", orgId)
      .eq("status", "active")
      .then(({ data }) => {
        if (!data) return;
        const rows = (data as Array<{
          id: string;
          agent_name: string;
          transport: "meta" | "evolution" | null;
          status: string;
          whatsapp_display_name: string | null;
          whatsapp_phone_number: string | null;
          whatsapp_phone_number_id: string | null;
          evolution_jid: string | null;
          evolution_connection_state: string | null;
        }>).filter((r) => {
          if (r.transport === "evolution") return !!r.whatsapp_phone_number || !!r.evolution_jid;
          return !!r.whatsapp_phone_number_id;
        });
        const mapped: ConnectedAgent[] = rows.map((r) => ({
          id: r.id,
          agent_name: r.agent_name,
          transport: (r.transport ?? "meta") as "meta" | "evolution",
          phone_label: r.transport === "evolution"
            ? (r.whatsapp_phone_number ?? (r.evolution_jid ? `+${r.evolution_jid.split("@")[0]}` : "—"))
            : (r.whatsapp_phone_number ?? "—"),
          display_name: r.whatsapp_display_name,
          state: r.transport === "evolution"
            ? ((r.evolution_connection_state as "open" | "close" | "connecting" | null) ?? (r.status === "active" ? "open" : "connecting"))
            : (r.status === "active" ? "open" : "connecting"),
        }));
        setConnectedAgents(mapped);
      });
  }, [orgId]);

  const [horarios, setHorarios] = useState(
    diasSemana.map((dia, i) => ({
      dia,
      ativo: i < 6,
      inicio: "08:00",
      fim: i === 5 ? "12:00" : "18:00",
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader title="Configurações" subtitle="Gerencie seu perfil e preferências" />

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-[#1e1e1e] rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[#222] text-white "
                : "text-[#888] hover:text-[#999]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Tab: Empresa */}
        {activeTab === "empresa" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <CompanyInfoForm />
          </motion.div>
        )}

        {/* Tab: Perfil */}
        {activeTab === "perfil" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SectionCard title="Perfil">
              <div className="space-y-4">
                <InputField label="Nome" value={nome} onChange={setNome} />
                <InputField label="Email" value={email} readOnly />
                <InputField label="Cargo" value={cargo} onChange={setCargo} />
              </div>
              <button className="flex items-center gap-2 mt-5 px-4 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-sm font-medium rounded-xl transition-colors">
                <Save size={16} />
                Salvar
              </button>
            </SectionCard>

            <SectionCard title="Empresa">
              <div className="space-y-4">
                <InputField label="Nome da Empresa" value={empresa} onChange={setEmpresa} />
                <InputField label="Setor" value={setor} onChange={setSetor} />
                <InputField label="Endereço" value={endereco} onChange={setEndereco} />
              </div>
              <button className="flex items-center gap-2 mt-5 px-4 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-sm font-medium rounded-xl transition-colors">
                <Save size={16} />
                Salvar
              </button>
            </SectionCard>

            <SectionCard title="Horário de Funcionamento">
              <p className="text-sm text-[#888] mb-4">Defina quando os agentes devem atender.</p>
              <div className="space-y-3">
                {horarios.map((h, idx) => (
                  <div key={h.dia} className="flex items-center gap-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={h.ativo}
                      onClick={() => {
                        const next = [...horarios];
                        next[idx] = { ...next[idx], ativo: !next[idx].ativo };
                        setHorarios(next);
                      }}
                      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${h.ativo ? "bg-[#5B9BF3]" : "bg-[#333]"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${h.ativo ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                    <span className={`text-sm w-20 ${h.ativo ? "text-[#666]" : "text-[#999]"}`}>{h.dia}</span>
                    {h.ativo ? (
                      <div className="flex items-center gap-2 text-sm text-[#999]">
                        <input
                          type="time"
                          value={h.inicio}
                          onChange={(e) => {
                            const next = [...horarios];
                            next[idx] = { ...next[idx], inicio: e.target.value };
                            setHorarios(next);
                          }}
                          className="bg-[#151515] border border-[#333] rounded-lg px-2 py-1 text-white text-sm"
                        />
                        <span className="text-[#999]">até</span>
                        <input
                          type="time"
                          value={h.fim}
                          onChange={(e) => {
                            const next = [...horarios];
                            next[idx] = { ...next[idx], fim: e.target.value };
                            setHorarios(next);
                          }}
                          className="bg-[#151515] border border-[#333] rounded-lg px-2 py-1 text-white text-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-[#999]">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 mt-5 px-4 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-sm font-medium rounded-xl transition-colors">
                <Save size={16} />
                Salvar
              </button>
            </SectionCard>
          </motion.div>
        )}

        {/* Tab: Canais */}
        {activeTab === "canais" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* WhatsApp — lista todos os agentes conectados (Meta + Evolution) */}
            <div className="bg-[#151515] border border-[#333] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <MessageCircle size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">WhatsApp</p>
                    <p className="text-[11px] text-[#999]">
                      {connectedAgents.length > 0
                        ? `${connectedAgents.filter((a) => a.state === "open").length} de ${connectedAgents.length} agente(s) conectado(s)`
                        : "Nenhum agente conectado"}
                    </p>
                  </div>
                </div>
                <a
                  href="/dashboard/agentes/novo"
                  className="px-3 py-1.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  + Novo agente
                </a>
              </div>

              {connectedAgents.length === 0 ? (
                <div className="border border-dashed border-[#333] rounded-xl p-6 text-center">
                  <p className="text-sm text-[#888] mb-1">Você ainda não conectou nenhum WhatsApp.</p>
                  <p className="text-[12px] text-[#666]">Crie um agente novo e conecte um número via pareamento.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {connectedAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <MessageCircle size={14} className="text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">{agent.agent_name}</p>
                          <p className="text-[11px] text-[#666] font-mono truncate">
                            {agent.display_name ? `${agent.display_name} · ` : ""}{agent.phone_label}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#1e1e1e] text-[9px] font-mono uppercase text-[#999] tracking-wider">
                          {agent.transport === "evolution" ? "Evolution" : "Meta Cloud"}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                          agent.state === "open"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : agent.state === "connecting"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-red-500/15 text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            agent.state === "open" ? "bg-emerald-400" : agent.state === "connecting" ? "bg-amber-400" : "bg-red-400"
                          }`} />
                          {agent.state === "open" ? "Conectado" : agent.state === "connecting" ? "Pareando" : "Offline"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-[#222] flex flex-wrap gap-3 text-[11px] text-[#666]">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Conectado</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pareamento em andamento</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Sessão caída — reabrir no celular</span>
              </div>
            </div>

            {/* Voz — em breve */}
            <div className="bg-[#111] border border-[#333] rounded-2xl p-5 opacity-60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <Phone size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#ccc]">Voz</p>
                    <p className="text-[11px] text-[#999]">Atendimento por chamadas telefônicas</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e1e1e] text-[10px] font-mono uppercase text-[#999] tracking-wider">
                  Em breve
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab: Integrações */}
        {activeTab === "integracoes" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-[#888] mb-6">Conecte ferramentas externas para sincronizar dados automaticamente.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { nome: "HubSpot", desc: "CRM e automação de marketing", icon: Zap, cor: "text-orange-400", bgCor: "bg-orange-500/10" },
                { nome: "Pipedrive", desc: "CRM de vendas", icon: Zap, cor: "text-green-400", bgCor: "bg-green-500/10" },
                { nome: "Zapier", desc: "Automação entre apps", icon: Zap, cor: "text-amber-400", bgCor: "bg-amber-500/10" },
                { nome: "Google Calendar", desc: "Sincronizar agendamentos", icon: CalendarIcon, cor: "text-blue-400", bgCor: "bg-blue-500/10" },
              ].map((integ) => (
                <div key={integ.nome} className="bg-[#111] border border-[#333] rounded-2xl p-5 opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${integ.bgCor} flex items-center justify-center`}>
                      <integ.icon size={18} className={integ.cor} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#888]">{integ.nome}</p>
                      <p className="text-[11px] text-[#999]">{integ.desc}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e1e1e] text-[10px] font-mono uppercase text-[#999] tracking-wider">
                    Em breve
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
