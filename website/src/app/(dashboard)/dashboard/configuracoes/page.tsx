"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Phone, MessageCircle, Zap, Calendar as CalendarIcon } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import CompanyInfoForm from "@/components/dashboard/CompanyInfoForm";
import ConnectWhatsAppButton from "@/components/dashboard/ConnectWhatsAppButton";
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

  const [waConnection, setWaConnection] = useState<{
    id: string;
    display_name: string | null;
    phone_number_id: string;
  } | null>(null);

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
      .select("id, whatsapp_display_name, whatsapp_phone_number_id")
      .eq("organization_id", orgId)
      .not("whatsapp_phone_number_id", "is", null)
      .limit(1)
      .maybeSingle<{ id: string; whatsapp_display_name: string | null; whatsapp_phone_number_id: string }>()
      .then(({ data }) => {
        if (data) {
          setWaConnection({
            id: data.id,
            display_name: data.whatsapp_display_name,
            phone_number_id: data.whatsapp_phone_number_id,
          });
        }
      });
  }, [orgId]);

  async function handleDisconnectWhatsApp() {
    if (!waConnection) return;
    if (!confirm("Desconectar o WhatsApp? O número vai parar de receber/enviar mensagens pelo agente.")) return;
    const supabase = createClient();
    await supabase
      .from("agent_provisioning")
      .update({
        waba_id: null,
        whatsapp_phone_number_id: null,
        whatsapp_display_name: null,
        tenant_access_token_encrypted: null,
        status: "pending",
      })
      .eq("id", waConnection.id);
    setWaConnection(null);
  }

  const [vozAtivo, setVozAtivo] = useState(true);
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

            <SectionCard title="Plano">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#5B9BF3]/15 text-[#5B9BF3] text-sm font-medium">
                  Starter
                </span>
                <span className="text-sm text-[#888]">R$ 500/agente/mês</span>
              </div>
              <a href="#" className="inline-block mt-4 text-sm text-[#5B9BF3] hover:text-[#5B9BF3]/80 transition-colors">
                Fazer upgrade &rarr;
              </a>
            </SectionCard>
          </motion.div>
        )}

        {/* Tab: Canais */}
        {activeTab === "canais" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Voz */}
              <div className="bg-[#151515] border border-[#333] rounded-2xl p-5 ">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                      <Phone size={18} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Voz</p>
                      <p className="text-[11px] text-[#999]">Twilio + Vapi</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={vozAtivo}
                    onClick={() => setVozAtivo(!vozAtivo)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${vozAtivo ? "bg-emerald-500" : "bg-[#333]"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${vozAtivo ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#888]">
                    <span>Número</span>
                    <span className="text-[#666]">+1 (681) 281-2439</span>
                  </div>
                  <div className="flex justify-between text-[#888]">
                    <span>Status</span>
                    <span className={vozAtivo ? "text-emerald-400" : "text-[#666]"}>{vozAtivo ? "Ativo" : "Inativo"}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-[#151515] border border-[#333] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                      <MessageCircle size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">WhatsApp</p>
                      <p className="text-[11px] text-[#999]">WhatsApp Cloud API · Meta oficial</p>
                    </div>
                  </div>
                  {waConnection && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                      Conectado
                    </span>
                  )}
                </div>
                {waConnection ? (
                  <div className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-[#888]">
                        <span>Nome de exibição</span>
                        <span className="text-[#ccc]">{waConnection.display_name ?? "—"}</span>
                      </div>
                      <div className="flex justify-between text-[#888]">
                        <span>Phone Number ID</span>
                        <span className="text-[#666] font-mono text-xs">{waConnection.phone_number_id}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnectWhatsApp}
                      className="w-full px-4 py-2 bg-transparent hover:bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium rounded-xl transition-colors"
                    >
                      Desconectar WhatsApp
                    </button>
                  </div>
                ) : (
                  <ConnectWhatsAppButton
                    onConnected={(r) => {
                      if (r.ok && r.phone_number_id) {
                        setWaConnection({
                          id: "",
                          display_name: r.display_name ?? null,
                          phone_number_id: r.phone_number_id,
                        });
                      }
                    }}
                  />
                )}
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
