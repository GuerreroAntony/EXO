"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Headphones,
  DollarSign,
  Calendar,
  Check,
  Sparkles,
  Volume2,
  Loader2,
  Rocket,
  Building2,
  User,
  MessageSquare,
  Mic,
  FileText,
} from "lucide-react";
import { agentTemplates, buildSystemPrompt, buildFirstMessage } from "@/data/agent-templates";
import { createClient } from "@/lib/supabase/client";

/* ───── Types ───── */
type AgentType = "recepcionista" | "sac" | "cobranca" | "agendamento";
type Tone = "amigavel" | "profissional" | "formal";

interface FormData {
  agentType: AgentType | null;
  name: string;
  tone: Tone;
  firstMessage: string;
  empresa: string;
  setor: string;
  diaInicio: string;
  diaFim: string;
  horaInicio: string;
  horaFim: string;
  telefone: string;
  conhecimento: string;
}

/* ───── Constants ───── */
const agentCards: { type: AgentType; label: string; desc: string; longDesc: string; skills: string[]; example: string; Icon: typeof Phone; color: string; bg: string; selectedBorder: string }[] = [
  {
    type: "recepcionista", label: "Recepcionista",
    desc: "Atende ligações, direciona para o setor certo",
    longDesc: "Um template completo para recepção e triagem de chamadas. Identifica a necessidade do cliente, responde dúvidas simples sobre a empresa e transfere para o setor correto com naturalidade.",
    skills: ["Triagem inteligente", "Info da empresa", "Transferência entre setores", "Coleta de dados"],
    example: "\"Olá, aqui é da Clínica Sorriso! Você gostaria de agendar uma consulta ou tem alguma dúvida?\"",
    Icon: Phone, color: "text-violet-400", bg: "bg-violet-500/15", selectedBorder: "border-violet-500/50",
  },
  {
    type: "sac", label: "SAC",
    desc: "Resolve dúvidas, registra reclamações",
    longDesc: "Um template focado em resolução de problemas com empatia e eficiência. Consulta a base de conhecimento, registra reclamações e abre tickets automaticamente quando não consegue resolver.",
    skills: ["Resolução de dúvidas", "Registro de reclamações", "Abertura de tickets", "Consulta à base de conhecimento"],
    example: "\"Entendo sua frustração. Deixa eu verificar o que aconteceu e já te dou um retorno, tá?\"",
    Icon: Headphones, color: "text-blue-400", bg: "bg-blue-500/15", selectedBorder: "border-blue-500/50",
  },
  {
    type: "cobranca", label: "Cobrança",
    desc: "Negocia pagamentos, oferece parcelamento",
    longDesc: "Um template especializado em negociação de dívidas com tom firme mas respeitoso. Consulta faturas em aberto, oferece opções de parcelamento pré-configuradas e registra acordos de pagamento.",
    skills: ["Consulta de faturas", "Negociação de dívidas", "Parcelamento automático", "Registro de acordos"],
    example: "\"Boa tarde! Estou ligando sobre uma pendência de R$500. Posso oferecer um desconto de 10% à vista ou parcelar em até 6x.\"",
    Icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/15", selectedBorder: "border-amber-500/50",
  },
  {
    type: "agendamento", label: "Agendamento",
    desc: "Agenda, confirma e remarca compromissos",
    longDesc: "Um template otimizado para gestão de agenda. Verifica disponibilidade, marca novos horários, confirma consultas na véspera e remarca quando necessário, tudo de forma automática.",
    skills: ["Novo agendamento", "Confirmação automática", "Remarcação", "Cancelamento com registro"],
    example: "\"Posso agendar sua consulta para terça, dia 8, às 14h com o Dr. Ricardo. Fica bom pra você?\"",
    Icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-500/15", selectedBorder: "border-emerald-500/50",
  },
];

const tones: { id: Tone; label: string; desc: string }[] = [
  { id: "amigavel", label: "Amigável", desc: "Informal, calorosa, uso de primeiro nome" },
  { id: "profissional", label: "Profissional", desc: "Cordial, objetiva, linguagem clara" },
  { id: "formal", label: "Formal", desc: "Polida, senhor/senhora, impecável" },
];

const stepsMeta = [
  { label: "Tipo", icon: Sparkles },
  { label: "Perfil", icon: User },
  { label: "Voz & Tom", icon: Mic },
  { label: "Conhecimento", icon: FileText },
  { label: "Pagamento", icon: DollarSign },
  { label: "Revisar", icon: Rocket },
];

/* ───── Component ───── */
export default function NovoAgentePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [activating, setActivating] = useState(false);
  const [provisionStatus, setProvisionStatus] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    agentType: null,
    name: "",
    tone: "amigavel",
    firstMessage: "",
    empresa: "Clínica Sorriso",
    setor: "Saúde",
    diaInicio: "Segunda",
    diaFim: "Sexta",
    horaInicio: "08:00",
    horaFim: "18:00",
    telefone: "",
    conhecimento: "",
  });

  const template = form.agentType ? agentTemplates.find((t) => t.type === form.agentType) : null;

  // Pré-preencher nome da empresa do perfil do cliente
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single()
        .then(({ data: profile }) => {
          if (!profile?.organization_id) return;
          supabase
            .from("organizations")
            .select("name")
            .eq("id", profile.organization_id)
            .single()
            .then(({ data: org }) => {
              if (org?.name) {
                setForm((prev) => ({ ...prev, empresa: org.name }));
              }
            });
        });
    });
  }, []);

  const horarioText = `${form.diaInicio} a ${form.diaFim}, das ${form.horaInicio} às ${form.horaFim}`;

  const update = useCallback((partial: Partial<FormData>) => {
    setForm((prev) => {
      const next = { ...prev, ...partial };
      // Auto-fill defaults when type changes
      if (partial.agentType && partial.agentType !== prev.agentType) {
        const tpl = agentTemplates.find((t) => t.type === partial.agentType);
        if (tpl) {
          next.name = tpl.defaultName;
          next.firstMessage = tpl.defaultFirstMessage
            .replace(/\{empresa\}/g, next.empresa || "Empresa")
            .replace(/\{agente_nome\}/g, tpl.defaultName);
        }
      }
      return next;
    });
  }, []);

  const canNext = (): boolean => {
    switch (step) {
      case 0: return !!form.agentType;
      case 1: return !!form.name && !!form.empresa;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const activate = async () => {
    if (!template || !form.agentType) return;
    setActivating(true);
    setProvisionStatus("Criando agente...");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      const orgId = profile?.organization_id;

      const systemPrompt = buildSystemPrompt(template, {
        empresa: form.empresa,
        setor: form.setor,
        agente_nome: form.name,
        tom: form.tone,
        horario: horarioText,
        conhecimento: form.conhecimento || undefined,
      });

      const firstMessage = buildFirstMessage(template, {
        empresa: form.empresa,
        agente_nome: form.name,
      });

      setProvisionStatus("Salvando configuração...");

      // Insert provisioning record
      const { data: provisioning, error } = await supabase
        .from("agent_provisioning")
        .insert({
          organization_id: orgId,
          agent_type: form.agentType,
          agent_name: form.name,
          tone: form.tone,
          system_prompt: systemPrompt,
          first_message: firstMessage,
          status: "pending",
          config_json: {
            empresa: form.empresa,
            setor: form.setor,
            horario: horarioText,
            conhecimento: form.conhecimento,
          },
        })
        .select()
        .single();

      if (error) throw error;

      setProvisionStatus("Provisionando no Vapi...");

      // Call provision edge function
      const provisionRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/provision-agent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provisioning_id: provisioning.id,
            organization_id: orgId,
            agent_type: form.agentType,
            agent_name: form.name,
            system_prompt: systemPrompt,
            first_message: firstMessage,
            voice_id: null,
            tone: form.tone,
            channels: ["voz"],
          }),
        }
      );

      if (provisionRes.ok) {
        // Poll for status
        let attempts = 0;
        const maxAttempts = 30;
        const pollInterval = setInterval(async () => {
          attempts++;
          const { data } = await supabase
            .from("agent_provisioning")
            .select("status, phone_number, vapi_assistant_id, error_message")
            .eq("id", provisioning.id)
            .single();

          if (data?.status === "active") {
            clearInterval(pollInterval);
            setProvisionStatus("Agente ativo!");
            setTimeout(() => router.push("/dashboard/agentes"), 1500);
          } else if (data?.status === "error") {
            clearInterval(pollInterval);
            setProvisionStatus(`Erro: ${data.error_message || "Falha no provisionamento"}`);
            setActivating(false);
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            // Even without the edge function, save as pending and redirect
            setProvisionStatus("Agente salvo! Provisionamento em andamento...");
            setTimeout(() => router.push("/dashboard/agentes"), 1500);
          } else {
            const statusMsg: Record<string, string> = {
              creating: "Criando assistente de IA...",
              configuring_phone: "Configurando telefone...",
              pending: "Na fila de provisionamento...",
            };
            setProvisionStatus(statusMsg[data?.status ?? ""] || "Processando...");
          }
        }, 2000);
      } else {
        // Edge function not deployed yet — save as pending anyway
        setProvisionStatus("Agente salvo! Ativação pendente.");
        setTimeout(() => router.push("/dashboard/agentes"), 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setProvisionStatus(`Erro: ${msg}`);
      setActivating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : router.push("/dashboard/agentes")}
          className="p-2 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-[#888] hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Novo Agente</h1>
          <p className="text-sm text-[#888]">Passo {step + 1} de {stepsMeta.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 mb-10">
        {stepsMeta.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < step
                    ? "bg-emerald-500/20 text-emerald-400"
                    : i === step
                      ? "bg-[#5B9BF3]/20 text-[#5B9BF3]"
                      : "bg-[#1e1e1e] text-[#999]"
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-[#666]" : "text-[#999]"}`}>
                {s.label}
              </span>
            </div>
            {i < stepsMeta.length - 1 && (
              <div className={`h-px flex-1 mx-2 ${i < step ? "bg-emerald-500/30" : "bg-[#222]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Step 0: Type Selection */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Escolha um template</h2>
              <p className="text-sm text-[#888] mb-6">Templates pré-configurados para começar rapidamente. Você pode personalizar tudo depois.</p>
              <div className="space-y-3">
                {agentCards.map((a) => (
                  <button
                    key={a.type}
                    onClick={() => update({ agentType: a.type })}
                    className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                      form.agentType === a.type
                        ? `${a.bg} ${a.selectedBorder} ring-1 ring-white/10`
                        : "bg-[#151515] border-[#333] hover:bg-[#1a1a1a] hover:border-[#2a2a2a]"
                    }`}
                  >
                    {form.agentType === a.type && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check size={14} className="text-emerald-400" />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${a.bg}`}>
                        <a.Icon size={20} className={a.color} />
                      </div>
                      <div className="flex-1 min-w-0 pr-8">
                        <h3 className="text-[15px] font-semibold text-white mb-1">{a.label}</h3>
                        <p className="text-[13px] text-[#999] mb-3">{a.longDesc}</p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {a.skills.map((skill) => (
                            <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#111] border border-[#333] text-[#888]">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Example */}
                        <div className="bg-[#111] rounded-lg px-3 py-2 border border-[#333]">
                          <p className="text-[12px] text-[#999] mb-0.5">Exemplo de conversa:</p>
                          <p className="text-[13px] text-[#666] italic">{a.example}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Profile */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Perfil do agente</h2>
              <p className="text-sm text-[#888] mb-6">Configure o nome e a empresa que ele representa.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#888] mb-2">
                    <User size={14} className="inline mr-1.5" />
                    Nome do agente
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="Ex: Sofia, Ana, Carlos..."
                    className="w-full bg-[#151515] border border-[#333] rounded-xl px-4 py-3 text-white placeholder:text-[#999] focus:border-[#5B9BF3]/50 focus:ring-1 focus:ring-[#5B9BF3]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#888] mb-2">
                    <Building2 size={14} className="inline mr-1.5" />
                    Nome da empresa
                  </label>
                  <input
                    type="text"
                    value={form.empresa}
                    readOnly
                    className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[#888] cursor-not-allowed outline-none"
                  />
                  <p className="text-[11px] text-[#999] mt-1.5">Definido nas configurações da organização</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#888] mb-2">Setor</label>
                    <input
                      type="text"
                      value={form.setor}
                      readOnly
                      className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[#888] cursor-not-allowed outline-none"
                    />
                    <p className="text-[11px] text-[#999] mt-1.5">Definido nas configurações da organização</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#888] mb-3">
                      <Calendar size={14} className="inline mr-1.5" />
                      Horário de funcionamento
                    </label>
                    <div className="bg-[#151515] border border-[#333] rounded-xl p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Início */}
                        <div>
                          <p className="text-[11px] text-[#5B9BF3] font-medium uppercase tracking-wider mb-3">De</p>
                          <div className="space-y-2">
                            <select
                              value={form.diaInicio}
                              onChange={(e) => update({ diaInicio: e.target.value })}
                              className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#5B9BF3]/50 cursor-pointer"
                            >
                              {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                            <input
                              type="time"
                              value={form.horaInicio}
                              onChange={(e) => update({ horaInicio: e.target.value })}
                              className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#5B9BF3]/50"
                            />
                          </div>
                        </div>
                        {/* Separador */}
                        <div>
                          <p className="text-[11px] text-[#5B9BF3] font-medium uppercase tracking-wider mb-3">Até</p>
                          <div className="space-y-2">
                            <select
                              value={form.diaFim}
                              onChange={(e) => update({ diaFim: e.target.value })}
                              className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#5B9BF3]/50 cursor-pointer"
                            >
                              {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                            <input
                              type="time"
                              value={form.horaFim}
                              onChange={(e) => update({ horaFim: e.target.value })}
                              className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#5B9BF3]/50"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#666] mt-3 text-center">{horarioText}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#888] mb-2">
                    <Phone size={14} className="inline mr-1.5" />
                    Número de telefone do agente
                  </label>
                  <div className="bg-[#151515] border border-[#333] rounded-xl p-4">
                    <input
                      type="tel"
                      value={form.telefone}
                      onChange={(e) => update({ telefone: e.target.value })}
                      placeholder="+55 (11) 99999-9999"
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#555] focus:border-[#5B9BF3]/50 outline-none transition-all"
                    />
                    <p className="text-[12px] text-[#666] mt-3">
                      Opcional — deixe vazio e geraremos um número dedicado na ativação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Voice & Tone */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Tom de voz</h2>
              <p className="text-sm text-[#888] mb-6">Como seu agente vai se comunicar com os clientes.</p>


              <div className="space-y-3 mb-8">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => update({ tone: t.id })}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      form.tone === t.id
                        ? "bg-[#5B9BF3]/10 border-[#5B9BF3]/30"
                        : "bg-[#151515] border-[#333] hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[15px] font-medium text-white">{t.label}</span>
                        <p className="text-[13px] text-[#888] mt-0.5">{t.desc}</p>
                      </div>
                      {form.tone === t.id && (
                        <div className="w-5 h-5 rounded-full bg-[#5B9BF3]/20 flex items-center justify-center">
                          <Check size={12} className="text-[#5B9BF3]" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#888] mb-2">
                  <MessageSquare size={14} className="inline mr-1.5" />
                  Primeira mensagem
                </label>
                <textarea
                  value={form.firstMessage}
                  onChange={(e) => update({ firstMessage: e.target.value })}
                  rows={3}
                  placeholder="O que o agente diz ao atender a ligação..."
                  className="w-full bg-[#151515] border border-[#333] rounded-xl px-4 py-3 text-white placeholder:text-[#999] focus:border-[#5B9BF3]/50 focus:ring-1 focus:ring-[#5B9BF3]/20 outline-none transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Knowledge Base */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Base de conhecimento</h2>
              <p className="text-sm text-[#888] mb-6">
                Adicione informações que o agente precisa saber sobre sua empresa. Quanto mais detalhado, melhor o atendimento.
              </p>
              <textarea
                value={form.conhecimento}
                onChange={(e) => update({ conhecimento: e.target.value })}
                rows={12}
                placeholder={`Exemplo:\n\n- Serviços oferecidos: Limpeza dental, Clareamento, Ortodontia\n- Preços: Limpeza R$150, Clareamento R$500\n- Formas de pagamento: Pix, crédito até 6x, convênios\n- Endereço: Rua das Flores, 123, Centro\n- Estacionamento: Sim, gratuito\n- Perguntas frequentes:\n  P: Aceita convênio? R: Sim, Amil, Bradesco e Odontoprev\n  P: Tem emergência? R: Sim, seg-sex até 20h`}
                className="w-full bg-[#151515] border border-[#333] rounded-xl px-4 py-3 text-white text-[14px] leading-relaxed placeholder:text-[#444] focus:border-[#5B9BF3]/50 focus:ring-1 focus:ring-[#5B9BF3]/20 outline-none transition-all resize-none font-mono"
              />
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Pagamento</h2>
              <p className="text-sm text-[#888] mb-6">Escolha o plano para ativar seu agente.</p>

              <div className="bg-[#151515] border border-[#333] rounded-2xl p-6  mb-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">1x Agente IA</h3>
                    <p className="text-sm text-[#888] mt-1">
                      {agentCards.find((c) => c.type === form.agentType)?.label} &mdash; {form.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">R$ 500</p>
                    <p className="text-xs text-[#888]">/mês</p>
                  </div>
                </div>

                <div className="border-t border-[#333] pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#999]">Agente de IA 24/7</span>
                    <Check size={16} className="text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#999]">Número de telefone dedicado</span>
                    <Check size={16} className="text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#999]">Chamadas ilimitadas</span>
                    <Check size={16} className="text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#999]">Transferência entre agentes</span>
                    <Check size={16} className="text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#999]">Dashboard com métricas</span>
                    <Check size={16} className="text-emerald-400" />
                  </div>
                </div>

                <div className="border-t border-[#333] mt-4 pt-4 flex items-center justify-between">
                  <span className="text-white font-semibold">Total mensal</span>
                  <span className="text-xl font-bold text-white">R$ 500<span className="text-sm font-normal text-[#888]">/mês</span></span>
                </div>
              </div>

              <div className="bg-[#5B9BF3]/5 border border-[#5B9BF3]/20 rounded-xl p-4 flex items-center gap-3">
                <Sparkles size={18} className="text-[#5B9BF3] shrink-0" />
                <p className="text-sm text-[#888]">
                  <strong className="text-white">7 dias grátis</strong> &mdash; cancele a qualquer momento. Após o trial, a cobrança é mensal via cartão ou Pix.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Revisar e ativar</h2>
              <p className="text-sm text-[#888] mb-6">Confira as configurações do seu agente antes de ativar.</p>

              <div className="space-y-4">
                {/* Agent summary card */}
                <div className="bg-[#151515] border border-[#333] rounded-2xl p-6 ">
                  <div className="flex items-center gap-4 mb-5">
                    {(() => {
                      const card = agentCards.find((c) => c.type === form.agentType);
                      if (!card) return null;
                      return (
                        <>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                            <card.Icon size={22} className={card.color} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{form.name}</h3>
                            <p className="text-sm text-[#888]">{card.label} &middot; {form.tone}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#888]">Empresa</span>
                      <p className="text-white mt-0.5">{form.empresa}</p>
                    </div>
                    <div>
                      <span className="text-[#888]">Setor</span>
                      <p className="text-white mt-0.5">{form.setor}</p>
                    </div>
                    <div>
                      <span className="text-[#888]">Horário</span>
                      <p className="text-white mt-0.5">{horarioText}</p>
                    </div>
                    <div>
                      <span className="text-[#888]">Telefone</span>
                      <p className="text-white mt-0.5 font-mono">{form.telefone || "Não definido"}</p>
                    </div>
                    <div>
                      <span className="text-[#888]">Canal</span>
                      <p className="text-white mt-0.5">Voz (telefone)</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#333]">
                    <span className="text-[#888] text-sm">Primeira mensagem</span>
                    <p className="text-white text-sm mt-1 italic">&ldquo;{form.firstMessage}&rdquo;</p>
                  </div>

                  {form.conhecimento && (
                    <div className="mt-4 pt-4 border-t border-[#333]">
                      <span className="text-[#888] text-sm">Base de conhecimento</span>
                      <p className="text-[#888] text-sm mt-1 line-clamp-3 font-mono">{form.conhecimento}</p>
                    </div>
                  )}
                </div>

                {/* Cost preview */}
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-400">Custo estimado</p>
                      <p className="text-xs text-[#888] mt-0.5">Cobrado por minuto de uso real</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">~R$ 0,75</p>
                      <p className="text-xs text-[#888]">/minuto</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Provisioning Overlay */}
      <AnimatePresence>
        {activating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#151515] border border-[#333] rounded-2xl p-8 max-w-sm w-full mx-4 text-center "
            >
              {provisionStatus?.startsWith("Erro") ? (
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-400 text-xl">!</span>
                </div>
              ) : provisionStatus === "Agente ativo!" ? (
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-emerald-400" />
                </div>
              ) : (
                <Loader2 size={32} className="text-[#5B9BF3] animate-spin mx-auto mb-4" />
              )}
              <h3 className="text-lg font-semibold text-white mb-2">
                {provisionStatus?.startsWith("Erro") ? "Falha" : provisionStatus === "Agente ativo!" ? "Pronto!" : "Ativando agente"}
              </h3>
              <p className="text-sm text-[#999]">{provisionStatus}</p>
              {provisionStatus?.startsWith("Erro") && (
                <button
                  onClick={() => { setActivating(false); setProvisionStatus(null); }}
                  className="mt-4 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl text-sm text-[#888] transition-colors"
                >
                  Tentar novamente
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#333]">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : router.push("/dashboard/agentes")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#999] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          {step === 0 ? "Cancelar" : "Voltar"}
        </button>

        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all"
          >
            Próximo
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={activate}
            disabled={activating}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
          >
            <Rocket size={16} />
            Ativar Agente
          </button>
        )}
      </div>
    </div>
  );
}
