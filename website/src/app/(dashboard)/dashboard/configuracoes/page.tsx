"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Phone, MessageCircle, Zap, Calendar as CalendarIcon } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";

function InputField({ label, value, onChange, readOnly = false }: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] font-mono text-white/40 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors ${readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="text-sm text-white/70">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-[#5B9BF3]" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur p-6">
      <h3 className="text-base font-semibold text-white mb-5">{title}</h3>
      {children}
    </div>
  );
}

const tabs = [
  { id: "perfil", label: "Perfil" },
  { id: "canais", label: "Canais" },
  { id: "notificacoes", label: "Notificações" },
  { id: "integracoes", label: "Integrações" },
];

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [nome, setNome] = useState("Dr. Ricardo Mendes");
  const [cargo, setCargo] = useState("Dentista / Proprietário");
  const [empresa, setEmpresa] = useState("Clínica Sorriso");
  const [setor, setSetor] = useState("Odontologia");
  const [endereco, setEndereco] = useState("Av. Paulista, 1000 - São Paulo, SP");
  const [emailNotif, setEmailNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(true);
  const [escalacaoEmail, setEscalacaoEmail] = useState(true);
  const [escalacaoWhatsapp, setEscalacaoWhatsapp] = useState(true);
  const [vozAtivo, setVozAtivo] = useState(true);
  const [whatsappAtivo, setWhatsappAtivo] = useState(true);
  const [horarios, setHorarios] = useState(
    diasSemana.map((dia, i) => ({
      dia,
      ativo: i < 6,
      inicio: i === 5 ? "08:00" : "08:00",
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
      <div className="flex gap-1 mb-6 bg-white/[0.03] rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Tab: Perfil */}
        {activeTab === "perfil" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SectionCard title="Perfil">
              <div className="space-y-4">
                <InputField label="Nome" value={nome} onChange={setNome} />
                <InputField label="Email" value="ricardo@clinicasorriso.com.br" readOnly />
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

            <SectionCard title="Plano">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#5B9BF3]/15 text-[#5B9BF3] text-sm font-medium">
                  Pro
                </span>
                <span className="text-sm text-white/40">4 agentes ativos, atendimentos ilimitados</span>
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
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                      <Phone size={18} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Voz</p>
                      <p className="text-[11px] text-white/30">Twilio + Vapi</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={vozAtivo}
                    onClick={() => setVozAtivo(!vozAtivo)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${vozAtivo ? "bg-emerald-500" : "bg-white/10"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${vozAtivo ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/40">
                    <span>Número</span>
                    <span className="text-white/60">+55 (11) 3000-0001</span>
                  </div>
                  <div className="flex justify-between text-white/40">
                    <span>Status</span>
                    <span className={vozAtivo ? "text-emerald-400" : "text-white/30"}>{vozAtivo ? "Ativo" : "Inativo"}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                      <MessageCircle size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">WhatsApp</p>
                      <p className="text-[11px] text-white/30">Baileys Provider</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={whatsappAtivo}
                    onClick={() => setWhatsappAtivo(!whatsappAtivo)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${whatsappAtivo ? "bg-emerald-500" : "bg-white/10"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${whatsappAtivo ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/40">
                    <span>Número</span>
                    <span className="text-white/60">+55 (11) 99000-0001</span>
                  </div>
                  <div className="flex justify-between text-white/40">
                    <span>Status</span>
                    <span className={whatsappAtivo ? "text-emerald-400" : "text-white/30"}>{whatsappAtivo ? "Ativo" : "Inativo"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab: Notificações */}
        {activeTab === "notificacoes" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SectionCard title="Notificações Gerais">
              <div className="space-y-1">
                <Toggle label="Notificações por email" checked={emailNotif} onChange={setEmailNotif} />
                <Toggle label="Notificações por WhatsApp" checked={whatsappNotif} onChange={setWhatsappNotif} />
              </div>
            </SectionCard>

            <SectionCard title="Alertas de Escalonamento">
              <p className="text-sm text-white/40 mb-4">Receba alertas quando um agente IA escalonar um atendimento.</p>
              <div className="space-y-1">
                <Toggle label="Alerta por email" checked={escalacaoEmail} onChange={setEscalacaoEmail} />
                <Toggle label="Alerta por WhatsApp" checked={escalacaoWhatsapp} onChange={setEscalacaoWhatsapp} />
              </div>
              {escalacaoEmail && (
                <div className="mt-4">
                  <InputField label="Email para alertas" value="ricardo@clinicasorriso.com.br" readOnly />
                </div>
              )}
              {escalacaoWhatsapp && (
                <div className="mt-4">
                  <InputField label="WhatsApp para alertas" value="(11) 99876-5432" readOnly />
                </div>
              )}
            </SectionCard>

            <SectionCard title="Horário de Funcionamento">
              <p className="text-sm text-white/40 mb-4">Defina quando os agentes devem atender.</p>
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
                      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${h.ativo ? "bg-[#5B9BF3]" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${h.ativo ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                    <span className={`text-sm w-20 ${h.ativo ? "text-white/70" : "text-white/25"}`}>{h.dia}</span>
                    {h.ativo ? (
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <input
                          type="time"
                          value={h.inicio}
                          onChange={(e) => {
                            const next = [...horarios];
                            next[idx] = { ...next[idx], inicio: e.target.value };
                            setHorarios(next);
                          }}
                          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-white/60 text-sm"
                        />
                        <span className="text-white/20">até</span>
                        <input
                          type="time"
                          value={h.fim}
                          onChange={(e) => {
                            const next = [...horarios];
                            next[idx] = { ...next[idx], fim: e.target.value };
                            setHorarios(next);
                          }}
                          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 text-white/60 text-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-white/20">Fechado</span>
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

        {/* Tab: Integrações */}
        {activeTab === "integracoes" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-white/40 mb-6">Conecte ferramentas externas para sincronizar dados automaticamente.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { nome: "HubSpot", desc: "CRM e automação de marketing", icon: Zap, cor: "text-orange-400", bgCor: "bg-orange-500/10" },
                { nome: "Pipedrive", desc: "CRM de vendas", icon: Zap, cor: "text-green-400", bgCor: "bg-green-500/10" },
                { nome: "Zapier", desc: "Automação entre apps", icon: Zap, cor: "text-amber-400", bgCor: "bg-amber-500/10" },
                { nome: "Google Calendar", desc: "Sincronizar agendamentos", icon: CalendarIcon, cor: "text-blue-400", bgCor: "bg-blue-500/10" },
              ].map((integ) => (
                <div key={integ.nome} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${integ.bgCor} flex items-center justify-center`}>
                      <integ.icon size={18} className={integ.cor} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/60">{integ.nome}</p>
                      <p className="text-[11px] text-white/25">{integ.desc}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-mono uppercase text-white/25 tracking-wider">
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
