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
  Upload,
  X as XIcon,
  File as FileIcon,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  buildComposedSystemPrompt,
  buildComposedFirstMessage,
  getCapability,
  getDefaultName,
  type CapabilityType,
} from "@/data/agent-templates";
import { createClient } from "@/lib/supabase/client";

/* ───── Types ───── */
type AgentType = CapabilityType;
type Tone = "amigavel" | "profissional" | "formal";

interface FormData {
  capabilities: AgentType[];
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
  { label: "Revisar", icon: Rocket },
];

function formatPairingCode(code: string): string {
  const clean = code.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  if (clean.length === 8) return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  return clean;
}

/* ───── Component ───── */
interface UploadedSource {
  source_id: string;
  title: string;
  char_count: number;
  size_bytes: number;
}

interface PendingUpload {
  name: string;
  status: "uploading" | "error";
  error?: string;
}

export default function NovoAgentePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [activating, setActivating] = useState(false);
  const [provisionStatus, setProvisionStatus] = useState<string | null>(null);
  const [uploadedSources, setUploadedSources] = useState<UploadedSource[]>([]);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);

  // Evolution API pairing — conexão do WhatsApp do cliente via código de pareamento
  const [evoProvisioningId, setEvoProvisioningId] = useState<string | null>(null);
  const [evoInstance, setEvoInstance] = useState<string | null>(null);
  const [evoPairing, setEvoPairing] = useState<string | null>(null);
  const [evoState, setEvoState] = useState<"idle" | "creating" | "waiting" | "open" | "error">("idle");
  const [evoError, setEvoError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    capabilities: [],
    name: "",
    tone: "amigavel",
    firstMessage: "",
    empresa: "",
    setor: "Serviços",
    diaInicio: "Segunda",
    diaFim: "Sexta",
    horaInicio: "08:00",
    horaFim: "18:00",
    telefone: "",
    conhecimento: "",
  });

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
      if (partial.capabilities && partial.capabilities !== prev.capabilities) {
        const caps = partial.capabilities;
        if (caps.length > 0 && !prev.name) {
          const defaultName = getDefaultName(caps);
          next.name = defaultName;
          next.firstMessage = buildComposedFirstMessage(caps, {
            empresa: next.empresa || "nossa empresa",
            agente_nome: defaultName,
          });
        }
      }
      return next;
    });
  }, []);

  const toggleCapability = useCallback((type: AgentType) => {
    setForm((prev) => {
      const has = prev.capabilities.includes(type);
      const nextCaps = has ? prev.capabilities.filter((c) => c !== type) : [...prev.capabilities, type];
      const next = { ...prev, capabilities: nextCaps };
      if (nextCaps.length > 0 && !prev.name) {
        const defaultName = getDefaultName(nextCaps);
        next.name = defaultName;
        next.firstMessage = buildComposedFirstMessage(nextCaps, {
          empresa: prev.empresa || "nossa empresa",
          agente_nome: defaultName,
        });
      }
      return next;
    });
  }, []);

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const supabase = createClient();
    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token;
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    const accepted = Array.from(files).filter((f) => {
      const ext = f.name.toLowerCase().split(".").pop() || "";
      return ["pdf", "docx", "txt", "md"].includes(ext);
    });

    for (const file of accepted) {
      setPendingUploads((p) => [...p, { name: file.name, status: "uploading" }]);
      try {
        const base64 = await fileToBase64(file);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ingest-document`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ file_base64: base64, filename: file.name }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "upload_failed");
        setUploadedSources((u) => [
          ...u,
          {
            source_id: data.source_id,
            title: file.name,
            char_count: data.char_count,
            size_bytes: file.size,
          },
        ]);
        setPendingUploads((p) => p.filter((x) => x.name !== file.name));
      } catch (err) {
        setPendingUploads((p) =>
          p.map((x) => x.name === file.name ? { ...x, status: "error", error: String(err) } : x)
        );
      }
    }
  };

  const removeSource = async (sourceId: string) => {
    const supabase = createClient();
    await supabase.from("knowledge_sources").delete().eq("id", sourceId);
    setUploadedSources((u) => u.filter((s) => s.source_id !== sourceId));
  };

  const generatePairingCode = async () => {
    setEvoError(null);
    setEvoState("creating");
    try {
      const res = await fetch("/api/whatsapp/evolution/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.telefone,
          agentName: form.name,
          capabilities: form.capabilities,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Falha ao gerar código");
      setEvoProvisioningId(data.provisioningId);
      setEvoInstance(data.instanceName);
      setEvoPairing(data.pairingCode);
      setEvoState("waiting");
    } catch (err) {
      setEvoError(err instanceof Error ? err.message : String(err));
      setEvoState("error");
    }
  };

  const resetPairing = () => {
    setEvoProvisioningId(null);
    setEvoInstance(null);
    setEvoPairing(null);
    setEvoState("idle");
    setEvoError(null);
  };

  // Polling status da conexão até state=open
  useEffect(() => {
    if (!evoInstance || evoState !== "waiting") return;
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/whatsapp/evolution/status?instance=${encodeURIComponent(evoInstance)}`);
        const data = await res.json();
        if (!cancelled && data.ok && data.state === "open") {
          setEvoState("open");
        }
      } catch {
        // mantém polling em caso de erro transitório
      }
    };
    poll();
    const id = setInterval(poll, 2500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [evoInstance, evoState]);

  const canNext = (): boolean => {
    switch (step) {
      case 0: return form.capabilities.length > 0;
      case 1: return !!form.name && !!form.empresa && evoState === "open";
      case 2: return true;
      case 3: return pendingUploads.filter((p) => p.status === "uploading").length === 0;
      case 4: return true;
      default: return false;
    }
  };

  const activate = async () => {
    if (form.capabilities.length === 0) return;
    if (!evoProvisioningId || evoState !== "open") {
      setProvisionStatus("Erro: WhatsApp não conectado. Volte ao passo Perfil e conclua o pareamento.");
      return;
    }
    setActivating(true);
    setProvisionStatus("Salvando configuração...");

    try {
      const supabase = createClient();

      // Compor conhecimento (uploads + notas manuais)
      let knowledgeBlob = form.conhecimento || "";
      if (uploadedSources.length > 0) {
        const { data: sources } = await supabase
          .from("knowledge_sources")
          .select("title, extracted_text")
          .in("id", uploadedSources.map((s) => s.source_id));
        if (sources && sources.length > 0) {
          const filesText = sources
            .map((s) => `### ${s.title}\n${s.extracted_text}`)
            .join("\n\n---\n\n");
          knowledgeBlob = filesText + (knowledgeBlob ? `\n\n---\n\n### Notas adicionais\n${knowledgeBlob}` : "");
        }
      }

      const systemPrompt = buildComposedSystemPrompt(form.capabilities, {
        empresa: form.empresa,
        setor: form.setor,
        agente_nome: form.name,
        tom: form.tone,
        horario: horarioText,
        conhecimento: knowledgeBlob || undefined,
      });

      const firstMessage = buildComposedFirstMessage(form.capabilities, {
        empresa: form.empresa,
        agente_nome: form.name,
      });

      const agentTypeForDb: AgentType | "custom" =
        form.capabilities.length === 1 ? form.capabilities[0] : "custom";

      // Atualiza a linha draft criada no pairing — agora finaliza como active
      const { error } = await supabase
        .from("agent_provisioning")
        .update({
          agent_type: agentTypeForDb,
          capabilities: form.capabilities,
          agent_name: form.name,
          tone: form.tone,
          system_prompt: systemPrompt,
          first_message: firstMessage,
          status: "active",
          config_json: {
            empresa: form.empresa,
            setor: form.setor,
            horario: horarioText,
            conhecimento: form.conhecimento,
          },
        })
        .eq("id", evoProvisioningId);

      if (error) throw error;

      // Vincular conhecimentos à linha draft
      if (uploadedSources.length > 0) {
        await supabase
          .from("knowledge_sources")
          .update({ agent_id: evoProvisioningId })
          .in("id", uploadedSources.map((s) => s.source_id));
      }

      setProvisionStatus("Agente ativo!");
      setTimeout(() => router.push("/dashboard/agentes"), 1200);
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
          {/* Step 0: Capabilities Selection (multi) */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Escolha as capacidades</h2>
              <p className="text-sm text-[#888] mb-1">Selecione uma ou mais. Marque várias para um agente que faz tudo.</p>
              <p className="text-xs text-[#666] mb-6">
                {form.capabilities.length === 0
                  ? "Nenhuma capacidade selecionada"
                  : `${form.capabilities.length} selecionada${form.capabilities.length > 1 ? "s" : ""}`}
              </p>
              <div className="space-y-3">
                {agentCards.map((a) => {
                  const selected = form.capabilities.includes(a.type);
                  return (
                    <button
                      key={a.type}
                      onClick={() => toggleCapability(a.type)}
                      className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                        selected
                          ? `${a.bg} ${a.selectedBorder} ring-1 ring-white/10`
                          : "bg-[#151515] border-[#333] hover:bg-[#1a1a1a] hover:border-[#2a2a2a]"
                      }`}
                    >
                      <div className={`absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                        selected
                          ? "bg-emerald-500/20 border-emerald-500/50"
                          : "bg-[#111] border-[#333]"
                      }`}>
                        {selected && <Check size={14} className="text-emerald-400" />}
                      </div>

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
                  );
                })}
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
                    Número de WhatsApp do agente
                  </label>
                  <div className="bg-[#151515] border border-[#333] rounded-xl p-4">
                    <input
                      type="tel"
                      value={form.telefone}
                      onChange={(e) => {
                        update({ telefone: e.target.value });
                        if (evoState !== "idle") resetPairing();
                      }}
                      disabled={evoState === "creating" || evoState === "waiting" || evoState === "open"}
                      placeholder="+55 (11) 99999-9999"
                      className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#555] focus:border-[#5B9BF3]/50 outline-none transition-all disabled:opacity-60"
                    />
                    <p className="text-[12px] text-[#666] mt-3">
                      Obrigatório — número onde o WhatsApp está instalado. Vamos parear esse número com o agente.
                    </p>

                    {/* Pairing trigger */}
                    {evoState === "idle" && (
                      <button
                        type="button"
                        onClick={generatePairingCode}
                        disabled={!form.telefone || !form.name || !form.empresa}
                        className="mt-4 w-full bg-[#5B9BF3] hover:bg-[#4A8AE0] disabled:bg-[#222] disabled:text-[#555] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Gerar código de pareamento
                      </button>
                    )}

                    {evoState === "creating" && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-[#888]">
                        <Loader2 size={14} className="animate-spin" />
                        Criando instância na Evolution...
                      </div>
                    )}

                    {(evoState === "waiting" || evoState === "open") && evoPairing && (
                      <div className="mt-4 space-y-3">
                        <div className="bg-[#0d0d0d] border border-[#5B9BF3]/30 rounded-xl p-5 text-center">
                          <p className="text-[11px] uppercase tracking-wider text-[#5B9BF3] mb-2">Código de pareamento</p>
                          <p className="text-3xl font-mono font-bold text-white tracking-[0.3em]">
                            {formatPairingCode(evoPairing)}
                          </p>
                        </div>

                        <ol className="text-[13px] text-[#aaa] space-y-1.5 pl-4 list-decimal">
                          <li>Abra o WhatsApp no celular</li>
                          <li>Toque em <strong className="text-white">⋮ → Aparelhos conectados</strong></li>
                          <li>Toque em <strong className="text-white">Conectar com número de telefone</strong></li>
                          <li>Digite o código acima</li>
                        </ol>

                        {evoState === "waiting" && (
                          <div className="flex items-center gap-2 text-sm text-[#888]">
                            <Loader2 size={14} className="animate-spin" />
                            Aguardando conexão...
                            <button
                              type="button"
                              onClick={resetPairing}
                              className="ml-auto text-xs text-[#666] hover:text-white underline"
                            >
                              cancelar
                            </button>
                          </div>
                        )}

                        {evoState === "open" && (
                          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 text-sm text-emerald-400">
                            <CheckCircle2 size={16} />
                            WhatsApp conectado
                          </div>
                        )}
                      </div>
                    )}

                    {evoState === "error" && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-sm text-red-400">
                          <AlertCircle size={16} className="shrink-0 mt-0.5" />
                          <span>{evoError || "Falha ao gerar código de pareamento"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={resetPairing}
                          className="text-xs text-[#888] hover:text-white underline"
                        >
                          tentar novamente
                        </button>
                      </div>
                    )}
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
                Faça upload de documentos (PDF, DOCX, TXT, MD) que o agente vai usar pra responder os clientes. Quanto mais completo, melhor o atendimento.
              </p>

              {/* Dropzone */}
              <label
                htmlFor="knowledge-upload"
                className="block border-2 border-dashed border-[#333] rounded-2xl p-8 text-center cursor-pointer hover:border-[#5B9BF3]/50 hover:bg-[#5B9BF3]/5 transition-all mb-4"
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-[#5B9BF3]/50", "bg-[#5B9BF3]/5"); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove("border-[#5B9BF3]/50", "bg-[#5B9BF3]/5"); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-[#5B9BF3]/50", "bg-[#5B9BF3]/5");
                  handleFiles(e.dataTransfer.files);
                }}
              >
                <input
                  id="knowledge-upload"
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt,.md"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <Upload size={24} className="text-[#5B9BF3] mx-auto mb-3" />
                <p className="text-[14px] text-white font-medium mb-1">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-[12px] text-[#888]">PDF, DOCX, TXT ou MD — até 20 MB cada</p>
              </label>

              {/* Uploaded + pending list */}
              {(uploadedSources.length > 0 || pendingUploads.length > 0) && (
                <div className="space-y-2 mb-5">
                  {uploadedSources.map((s) => (
                    <div key={s.source_id} className="flex items-center gap-3 bg-[#151515] border border-emerald-500/20 rounded-xl px-4 py-3">
                      <FileIcon size={16} className="text-emerald-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white truncate">{s.title}</p>
                        <p className="text-[11px] text-[#888]">
                          {(s.size_bytes / 1024).toFixed(0)} KB · {s.char_count.toLocaleString("pt-BR")} caracteres extraídos
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSource(s.source_id)}
                        className="text-[#666] hover:text-red-400 transition-colors shrink-0"
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  ))}
                  {pendingUploads.map((p) => (
                    <div key={p.name} className={`flex items-center gap-3 bg-[#151515] border rounded-xl px-4 py-3 ${
                      p.status === "error" ? "border-red-500/30" : "border-[#333]"
                    }`}>
                      {p.status === "uploading" ? (
                        <Loader2 size={16} className="text-[#5B9BF3] animate-spin shrink-0" />
                      ) : (
                        <XIcon size={16} className="text-red-400 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white truncate">{p.name}</p>
                        <p className="text-[11px] text-[#888]">
                          {p.status === "uploading" ? "Processando..." : `Erro: ${p.error}`}
                        </p>
                      </div>
                      {p.status === "error" && (
                        <button
                          type="button"
                          onClick={() => setPendingUploads((x) => x.filter((f) => f.name !== p.name))}
                          className="text-[#666] hover:text-white shrink-0"
                        >
                          <XIcon size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Manual text */}
              <div>
                <label className="block text-sm font-medium text-[#888] mb-2">
                  <FileText size={14} className="inline mr-1.5" />
                  Notas adicionais (opcional)
                </label>
                <textarea
                  value={form.conhecimento}
                  onChange={(e) => update({ conhecimento: e.target.value })}
                  rows={6}
                  placeholder={`Informações complementares que não estão nos arquivos:\n- Horário especial\n- Avisos pontuais\n- Preferências de atendimento`}
                  className="w-full bg-[#151515] border border-[#333] rounded-xl px-4 py-3 text-white text-[14px] leading-relaxed placeholder:text-[#444] focus:border-[#5B9BF3]/50 focus:ring-1 focus:ring-[#5B9BF3]/20 outline-none transition-all resize-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Revisar e ativar</h2>
              <p className="text-sm text-[#888] mb-6">Confira as configurações do seu agente antes de ativar.</p>

              <div className="space-y-4">
                {/* Agent summary card */}
                <div className="bg-[#151515] border border-[#333] rounded-2xl p-6 ">
                  <div className="flex items-start gap-4 mb-5">
                    {(() => {
                      const cards = form.capabilities
                        .map((c) => agentCards.find((a) => a.type === c))
                        .filter((c): c is typeof agentCards[0] => !!c);
                      if (cards.length === 0) return null;
                      const primary = cards[0];
                      return (
                        <>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${primary.bg}`}>
                            <primary.Icon size={22} className={primary.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white">{form.name}</h3>
                            <p className="text-sm text-[#888]">
                              {cards.length === 1 ? `${cards[0].label} · ${form.tone}` : `Assistente completo · ${form.tone}`}
                            </p>
                            {cards.length > 1 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {cards.map((c) => (
                                  <span key={c.type} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${c.bg} ${c.color}`}>
                                    <c.Icon size={11} />
                                    {c.label}
                                  </span>
                                ))}
                              </div>
                            )}
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
