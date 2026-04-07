"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  agentTemplates,
  buildSystemPrompt,
  buildFirstMessage,
  getTemplateByType,
} from "@/data/agent-templates";
import type { AgentTemplate } from "@/data/agent-templates";
import {
  Bot,
  MessageSquare,
  CreditCard,
  Calendar,
  MessageCircle,
  Phone,
  Check,
  ArrowRight,
  ArrowLeft,
  Zap,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Volume2,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AgentId = "recepcionista" | "sac" | "cobranca" | "agendamento";
type ChannelId = "whatsapp" | "voz";
type ToneId = "amigavel" | "profissional" | "formal";

interface VoiceOption {
  voice_id: string;
  name: string;
  preview_url: string;
}

interface AgentConfig {
  name: string;
  tone: ToneId;
  voiceId: string;
  voiceName: string;
  firstMessage: string;
}

interface FormData {
  empresa: string;
  setor: string;
  tamanhoEquipe: string;
  agentes: AgentId[];
  agentConfigs: Record<AgentId, AgentConfig>;
  canais: ChannelId[];
  knowledge: string;
  faq: string;
}

interface ProvisioningStatus {
  agentId: AgentId;
  step: "creating" | "configuring" | "active" | "error";
  message: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Empresa",
  "Agentes",
  "Personalizar",
  "Canais",
  "Conhecimento",
  "Revisão",
];

const SETORES = [
  { value: "", label: "Selecione..." },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "varejo", label: "Varejo" },
  { value: "servicos", label: "Serviços" },
  { value: "financeiro", label: "Financeiro" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "outro", label: "Outro" },
];

const TAMANHOS = [
  { value: "", label: "Selecione..." },
  { value: "1-10", label: "1 - 10" },
  { value: "11-50", label: "11 - 50" },
  { value: "51-200", label: "51 - 200" },
  { value: "200+", label: "200+" },
];

const AGENTES_META: {
  id: AgentId;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "recepcionista", label: "Recepcionista", desc: "Atende e roteia chamadas", icon: Bot },
  { id: "sac", label: "SAC", desc: "Suporte ao cliente", icon: MessageSquare },
  { id: "cobranca", label: "Cobrança", desc: "Negociação de pagamentos", icon: CreditCard },
  { id: "agendamento", label: "Agendamento", desc: "Marca e confirma consultas", icon: Calendar },
];

const CANAIS: {
  id: ChannelId;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "whatsapp", label: "WhatsApp", desc: "Atendimento via WhatsApp Business", icon: MessageCircle },
  { id: "voz", label: "Voz", desc: "Ligações telefônicas com IA", icon: Phone },
];

const TONES: { id: ToneId; label: string }[] = [
  { id: "amigavel", label: "Amigável" },
  { id: "profissional", label: "Profissional" },
  { id: "formal", label: "Formal" },
];

function getDefaultAgentConfig(template: AgentTemplate, empresa: string): AgentConfig {
  return {
    name: template.defaultName,
    tone: "amigavel",
    voiceId: "",
    voiceName: "",
    firstMessage: template.defaultFirstMessage
      .replace(/\{empresa\}/g, empresa || "Sua Empresa")
      .replace(/\{agente_nome\}/g, template.defaultName),
  };
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Shared UI                                                          */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full bg-white/[0.08] border border-white/[0.15] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#5B9BF3]/50 focus:bg-white/[0.10] transition-colors";

const labelClass =
  "block text-[12px] font-mono text-white/60 uppercase tracking-wider mb-2";

function ProgressBar({ current }: { current: number }) {
  const progress = ((current - 1) / (TOTAL_STEPS - 1)) * 100;
  return (
    <div className="mb-8 relative bg-white/[0.06] border border-white/[0.10] rounded-2xl backdrop-blur-xl px-6 py-4 shadow-lg shadow-black/20">
      <div
        className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)" }}
      />
      <div className="flex justify-between mb-3">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const isActive = step === current;
          const isDone = step < current;
          return (
            <span
              key={label}
              className={`text-[10px] font-mono uppercase tracking-wider transition-colors ${
                isActive
                  ? "text-white font-semibold"
                  : isDone
                    ? "text-[#5B9BF3]"
                    : "text-white/25"
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#5B9BF3] to-[#7BB5FF] rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

function ToggleCard({
  selected,
  onClick,
  icon: Icon,
  label,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
        selected
          ? "border-[#5B9BF3]/30 bg-[#5B9BF3]/[0.05]"
          : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.15]"
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#5B9BF3] flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
      )}
      <Icon
        size={24}
        className={`mb-3 transition-colors ${
          selected ? "text-[#5B9BF3]" : "text-white/40 group-hover:text-white/60"
        }`}
      />
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-white/40 mt-1">{desc}</p>
    </button>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
      <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider min-w-[80px] pt-0.5">
        {label}
      </span>
      <span className="text-sm text-white/80">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Voice Selector                                                     */
/* ------------------------------------------------------------------ */

function VoiceSelector({
  selectedVoiceId,
  onSelect,
  voices,
  voicesLoading,
  voicesError,
}: {
  selectedVoiceId: string;
  onSelect: (voiceId: string, voiceName: string) => void;
  voices: VoiceOption[];
  voicesLoading: boolean;
  voicesError: boolean;
}) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function playPreview(voice: VoiceOption) {
    if (playingId === voice.voice_id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(voice.preview_url);
    audioRef.current = audio;
    setPlayingId(voice.voice_id);
    audio.play().catch(() => setPlayingId(null));
    audio.onended = () => setPlayingId(null);
  }

  if (voicesLoading) {
    return (
      <div className="flex items-center gap-2 text-white/30 text-xs py-3">
        <Loader2 size={14} className="animate-spin" />
        Carregando vozes...
      </div>
    );
  }

  if (voicesError || voices.length === 0) {
    return (
      <div className="text-white/30 text-xs py-3">
        Vozes indisponiveis no momento. Uma voz padrao sera atribuida automaticamente.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
      {voices.map((voice) => {
        const isSelected = selectedVoiceId === voice.voice_id;
        return (
          <button
            key={voice.voice_id}
            type="button"
            onClick={() => onSelect(voice.voice_id, voice.name)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${
              isSelected
                ? "border-[#5B9BF3]/30 bg-[#5B9BF3]/[0.05]"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                playPreview(voice);
              }}
              className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors flex-shrink-0 cursor-pointer"
            >
              {playingId === voice.voice_id ? (
                <Pause size={12} className="text-[#5B9BF3]" />
              ) : (
                <Play size={12} className="text-white/50 ml-0.5" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 truncate">{voice.name}</p>
            </div>
            {isSelected && (
              <Check size={16} className="text-[#5B9BF3] flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Steps                                                              */
/* ------------------------------------------------------------------ */

function Step1({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo à EXO</h1>
        <p className="text-white/50 text-sm">
          Vamos configurar sua operação em poucos minutos.
        </p>
      </div>

      <div>
        <label className={labelClass}>Nome da empresa</label>
        <input
          type="text"
          value={data.empresa}
          onChange={(e) => onChange({ empresa: e.target.value })}
          placeholder="Sua empresa"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Setor</label>
        <select
          value={data.setor}
          onChange={(e) => onChange({ setor: e.target.value })}
          className={inputClass + " appearance-none"}
        >
          {SETORES.map((s) => (
            <option key={s.value} value={s.value} className="bg-black text-white">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Tamanho da equipe</label>
        <select
          value={data.tamanhoEquipe}
          onChange={(e) => onChange({ tamanhoEquipe: e.target.value })}
          className={inputClass + " appearance-none"}
        >
          {TAMANHOS.map((t) => (
            <option key={t.value} value={t.value} className="bg-black text-white">
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Step2({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  function toggle(id: AgentId) {
    const next = data.agentes.includes(id)
      ? data.agentes.filter((a) => a !== id)
      : [...data.agentes, id];
    onChange({ agentes: next });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Quais agentes você precisa?
        </h1>
        <p className="text-white/50 text-sm">
          Selecione os agentes que deseja ativar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {AGENTES_META.map((a) => (
          <ToggleCard
            key={a.id}
            selected={data.agentes.includes(a.id)}
            onClick={() => toggle(a.id)}
            icon={a.icon}
            label={a.label}
            desc={a.desc}
          />
        ))}
      </div>
    </div>
  );
}

function Step3({
  data,
  onChange,
  voices,
  voicesLoading,
  voicesError,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  voices: VoiceOption[];
  voicesLoading: boolean;
  voicesError: boolean;
}) {
  const [expanded, setExpanded] = useState<AgentId | null>(
    data.agentes[0] ?? null
  );

  function updateAgentConfig(agentId: AgentId, patch: Partial<AgentConfig>) {
    const current = data.agentConfigs[agentId];
    if (!current) return;
    onChange({
      agentConfigs: {
        ...data.agentConfigs,
        [agentId]: { ...current, ...patch },
      },
    });
  }

  if (data.agentes.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Personalizar agentes</h1>
          <p className="text-white/50 text-sm">
            Volte e selecione pelo menos um agente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Personalizar agentes</h1>
        <p className="text-white/50 text-sm">
          Configure cada agente para combinar com sua empresa.
        </p>
      </div>

      <div className="space-y-3">
        {data.agentes.map((agentId) => {
          const meta = AGENTES_META.find((a) => a.id === agentId);
          const config = data.agentConfigs[agentId];
          const isExpanded = expanded === agentId;
          if (!meta || !config) return null;

          return (
            <div
              key={agentId}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] overflow-hidden"
            >
              {/* Accordion header */}
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : agentId)}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <meta.icon size={20} className="text-[#5B9BF3]" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{meta.label}</p>
                    <p className="text-xs text-white/40">{config.name}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-white/30" />
                ) : (
                  <ChevronDown size={16} className="text-white/30" />
                )}
              </button>

              {/* Accordion body */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-5 border-t border-white/[0.06] pt-4">
                      {/* Agent name */}
                      <div>
                        <label className={labelClass}>Nome do agente</label>
                        <input
                          type="text"
                          value={config.name}
                          onChange={(e) =>
                            updateAgentConfig(agentId, { name: e.target.value })
                          }
                          placeholder="Nome do agente"
                          className={inputClass}
                        />
                      </div>

                      {/* Tone selector */}
                      <div>
                        <label className={labelClass}>Tom de voz</label>
                        <div className="flex gap-2">
                          {TONES.map((tone) => (
                            <button
                              key={tone.id}
                              type="button"
                              onClick={() =>
                                updateAgentConfig(agentId, { tone: tone.id })
                              }
                              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                config.tone === tone.id
                                  ? "border-[#5B9BF3]/30 bg-[#5B9BF3]/[0.08] text-[#5B9BF3]"
                                  : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/[0.15]"
                              }`}
                            >
                              {tone.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Voice selector */}
                      <div>
                        <label className={labelClass}>
                          <Volume2 size={12} className="inline mr-1 -mt-0.5" />
                          Voz
                        </label>
                        <VoiceSelector
                          selectedVoiceId={config.voiceId}
                          onSelect={(voiceId, voiceName) =>
                            updateAgentConfig(agentId, { voiceId, voiceName })
                          }
                          voices={voices}
                          voicesLoading={voicesLoading}
                          voicesError={voicesError}
                        />
                      </div>

                      {/* First message */}
                      <div>
                        <label className={labelClass}>Primeira mensagem</label>
                        <textarea
                          value={config.firstMessage}
                          onChange={(e) =>
                            updateAgentConfig(agentId, {
                              firstMessage: e.target.value,
                            })
                          }
                          rows={3}
                          className={inputClass + " resize-none"}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step4({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  function toggle(id: ChannelId) {
    const next = data.canais.includes(id)
      ? data.canais.filter((c) => c !== id)
      : [...data.canais, id];
    onChange({ canais: next });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Como seus clientes vão falar com você?
        </h1>
        <p className="text-white/50 text-sm">
          Conecte os canais de atendimento.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CANAIS.map((c) => (
          <ToggleCard
            key={c.id}
            selected={data.canais.includes(c.id)}
            onClick={() => toggle(c.id)}
            icon={c.icon}
            label={c.label}
            desc={c.desc}
          />
        ))}
      </div>
    </div>
  );
}

function Step5({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const sectorQuestions: Record<string, { label: string; placeholder: string; key: string }[]> = {
    saude: [
      { label: "Horário de funcionamento", placeholder: "Ex: Segunda a sexta das 8h às 18h, sábados das 8h às 12h", key: "horario" },
      { label: "Endereço da clínica", placeholder: "Ex: Av. Paulista, 1000 - São Paulo, SP", key: "endereco" },
      { label: "Serviços oferecidos", placeholder: "Ex: Limpeza, restauração, implante, ortodontia, clareamento", key: "servicos" },
      { label: "Convênios aceitos", placeholder: "Ex: Amil Dental, Bradesco Saúde, SulAmérica", key: "convenios" },
      { label: "Formas de pagamento", placeholder: "Ex: PIX, cartão até 12x, boleto", key: "pagamento" },
    ],
    educacao: [
      { label: "Horário de funcionamento", placeholder: "Ex: Segunda a sexta das 7h às 19h", key: "horario" },
      { label: "Endereço", placeholder: "Ex: Rua da Escola, 500 - São Paulo, SP", key: "endereco" },
      { label: "Cursos oferecidos", placeholder: "Ex: Inglês, Espanhol, Programação, Música", key: "servicos" },
      { label: "Faixa etária atendida", placeholder: "Ex: Crianças a partir de 6 anos e adultos", key: "publico" },
      { label: "Formas de pagamento", placeholder: "Ex: PIX, cartão, boleto mensal", key: "pagamento" },
    ],
    varejo: [
      { label: "Horário de funcionamento", placeholder: "Ex: Segunda a sábado das 9h às 21h", key: "horario" },
      { label: "Endereço / loja online", placeholder: "Ex: Shopping Center Norte, loja 42 / www.minhaloja.com.br", key: "endereco" },
      { label: "Produtos principais", placeholder: "Ex: Roupas femininas, acessórios, calçados", key: "servicos" },
      { label: "Política de troca e devolução", placeholder: "Ex: Troca em até 30 dias com etiqueta", key: "politica" },
      { label: "Formas de pagamento", placeholder: "Ex: PIX, cartão até 10x, boleto", key: "pagamento" },
    ],
    servicos: [
      { label: "Horário de atendimento", placeholder: "Ex: Segunda a sexta das 8h às 18h", key: "horario" },
      { label: "Endereço / área de atuação", placeholder: "Ex: Atendemos toda a Grande São Paulo", key: "endereco" },
      { label: "Serviços oferecidos", placeholder: "Ex: Consultoria, manutenção, instalação", key: "servicos" },
      { label: "Prazo médio de atendimento", placeholder: "Ex: Orçamento em 24h, execução em até 5 dias úteis", key: "prazo" },
      { label: "Formas de pagamento", placeholder: "Ex: PIX, cartão, transferência", key: "pagamento" },
    ],
    financeiro: [
      { label: "Horário de atendimento", placeholder: "Ex: Segunda a sexta das 9h às 17h", key: "horario" },
      { label: "Serviços oferecidos", placeholder: "Ex: Contabilidade, assessoria fiscal, folha de pagamento", key: "servicos" },
      { label: "Documentos necessários", placeholder: "Ex: CNPJ, contrato social, últimos 3 balanços", key: "documentos" },
      { label: "Formas de pagamento", placeholder: "Ex: Boleto mensal, PIX", key: "pagamento" },
    ],
    tecnologia: [
      { label: "Horário de suporte", placeholder: "Ex: 24/7 via chat, comercial das 9h às 18h", key: "horario" },
      { label: "Produtos / serviços", placeholder: "Ex: SaaS de gestão, app mobile, integrações API", key: "servicos" },
      { label: "Planos e preços", placeholder: "Ex: Free, Pro R$99/mês, Enterprise sob consulta", key: "precos" },
      { label: "Canais de suporte", placeholder: "Ex: Chat, email, telefone, ticket", key: "suporte" },
    ],
    outro: [
      { label: "Horário de funcionamento", placeholder: "Ex: Segunda a sexta das 8h às 18h", key: "horario" },
      { label: "Endereço", placeholder: "Endereço ou área de atuação", key: "endereco" },
      { label: "Serviços oferecidos", placeholder: "Descreva seus principais serviços", key: "servicos" },
      { label: "Formas de pagamento", placeholder: "Ex: PIX, cartão, boleto", key: "pagamento" },
    ],
  };

  const questions = sectorQuestions[data.setor] || sectorQuestions.outro;

  // Parse knowledge into structured answers
  const parseAnswers = (): Record<string, string> => {
    try {
      return JSON.parse(data.knowledge || "{}");
    } catch {
      // Legacy free-text format
      return { _freetext: data.knowledge };
    }
  };

  const answers = parseAnswers();

  const updateAnswer = (key: string, value: string) => {
    const current = parseAnswers();
    current[key] = value;
    onChange({ knowledge: JSON.stringify(current) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Ensine seus agentes
        </h1>
        <p className="text-white/50 text-sm">
          Preencha as informações que seus agentes vão usar nas conversas.
        </p>
      </div>

      {/* Guided questions by sector */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.key}>
            <label className={labelClass}>{q.label}</label>
            <input
              type="text"
              value={answers[q.key] || ""}
              onChange={(e) => updateAnswer(q.key, e.target.value)}
              placeholder={q.placeholder}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      {/* FAQ section */}
      <div>
        <label className={labelClass}>Perguntas frequentes</label>
        <p className="text-xs text-white/30 mb-2">Uma pergunta e resposta por linha. Ex: "Aceitam convênio? Sim, aceitamos Amil e Bradesco."</p>
        <textarea
          value={data.faq}
          onChange={(e) => onChange({ faq: e.target.value })}
          placeholder={"Qual o horário de funcionamento? De segunda a sexta, das 8h às 18h.\nAceitam convênio? Sim, aceitamos Amil e Bradesco."}
          rows={4}
          className={inputClass + " resize-none"}
        />
      </div>

      {/* File upload area (coming soon) */}
      <div>
        <label className={labelClass}>Documentos</label>
        <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-8 text-center hover:border-white/[0.15] transition-colors cursor-not-allowed">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div>
              <p className="text-sm text-white/40">Arraste PDFs, DOCs ou planilhas aqui</p>
              <p className="text-xs text-white/20 mt-1">O sistema vai extrair as informações automaticamente</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.04] text-[10px] font-mono uppercase text-white/25 tracking-wider border border-white/[0.06]">
              Em breve
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-white/30 italic">
        Você pode editar tudo isso depois na Base de Conhecimento do dashboard.
      </p>
    </div>
  );
}

function Step6({
  data,
}: {
  data: FormData;
}) {
  const agentLabels = data.agentes.map((id) => {
    const config = data.agentConfigs[id];
    const meta = AGENTES_META.find((a) => a.id === id);
    const toneLbl = TONES.find((t) => t.id === config?.tone)?.label ?? "";
    return `${meta?.label ?? id} (${config?.name ?? "---"}, ${toneLbl}${config?.voiceName ? ", " + config.voiceName : ""})`;
  });

  const channelLabels = CANAIS.filter((c) => data.canais.includes(c.id)).map(
    (c) => c.label
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tudo pronto!</h1>
        <p className="text-white/50 text-sm">
          Revise suas configurações antes de ativar.
        </p>
      </div>

      <div className="space-y-4">
        <SummaryCard label="Empresa" value={data.empresa || "---"} />
        <SummaryCard
          label="Setor"
          value={SETORES.find((s) => s.value === data.setor)?.label || "---"}
        />
        <SummaryCard label="Equipe" value={data.tamanhoEquipe || "---"} />
        {agentLabels.map((lbl, i) => (
          <SummaryCard key={i} label={i === 0 ? "Agentes" : ""} value={lbl} />
        ))}
        <SummaryCard
          label="Canais"
          value={
            channelLabels.length > 0 ? channelLabels.join(", ") : "Nenhum selecionado"
          }
        />
        {data.knowledge && (
          <SummaryCard
            label="Info"
            value={
              data.knowledge.length > 80
                ? data.knowledge.slice(0, 80) + "..."
                : data.knowledge
            }
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Provisioning overlay                                               */
/* ------------------------------------------------------------------ */

function ProvisioningOverlay({
  statuses,
}: {
  statuses: ProvisioningStatus[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
    >
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Zap size={32} className="text-[#5B9BF3]" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Ativando seus agentes</h2>
          <p className="text-white/40 text-sm mt-1">Isso pode levar alguns instantes...</p>
        </div>

        <div className="space-y-4">
          {statuses.map((s) => {
            const meta = AGENTES_META.find((a) => a.id === s.agentId);
            return (
              <div
                key={s.agentId}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
              >
                {s.step === "active" ? (
                  <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
                ) : s.step === "error" ? (
                  <Circle size={20} className="text-red-400 flex-shrink-0" />
                ) : (
                  <Loader2
                    size={20}
                    className="text-[#5B9BF3] animate-spin flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    {meta?.label ?? s.agentId}
                  </p>
                  <p className="text-xs text-white/40">{s.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function OnboardingPage() {
  const router = useRouter();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionStatuses, setProvisionStatuses] = useState<ProvisioningStatus[]>([]);

  // Voices loaded once
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [voicesError, setVoicesError] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    empresa: "",
    setor: "",
    tamanhoEquipe: "",
    agentes: [],
    agentConfigs: {} as Record<AgentId, AgentConfig>,
    canais: [],
    knowledge: "",
    faq: "",
  });

  // Fetch voices when entering step 3
  useEffect(() => {
    if (currentStep === 3 && voices.length === 0 && !voicesLoading && !voicesError) {
      setVoicesLoading(true);
      fetch(`${supabaseUrl}/functions/v1/list-voices`)
        .then((res) => {
          if (!res.ok) throw new Error("Voice fetch failed");
          return res.json();
        })
        .then((data: VoiceOption[]) => {
          setVoices(data);
          setVoicesLoading(false);
        })
        .catch(() => {
          setVoicesError(true);
          setVoicesLoading(false);
        });
    }
  }, [currentStep, voices.length, voicesLoading, voicesError, supabaseUrl]);

  // Keep agentConfigs in sync when agents are added/removed
  useEffect(() => {
    setFormData((prev) => {
      const nextConfigs = { ...prev.agentConfigs };
      let changed = false;

      for (const agentId of prev.agentes) {
        if (!nextConfigs[agentId]) {
          const template = getTemplateByType(agentId);
          if (template) {
            nextConfigs[agentId] = getDefaultAgentConfig(template, prev.empresa);
            changed = true;
          }
        }
      }

      // Remove configs for deselected agents
      for (const key of Object.keys(nextConfigs) as AgentId[]) {
        if (!prev.agentes.includes(key)) {
          delete nextConfigs[key];
          changed = true;
        }
      }

      if (!changed) return prev;
      return { ...prev, agentConfigs: nextConfigs };
    });
  }, [formData.agentes, formData.empresa]);

  function updateForm(patch: Partial<FormData>) {
    setFormData((prev) => ({ ...prev, ...patch }));
  }

  function next() {
    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }

  function prev() {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Activation / provisioning                                        */
  /* ---------------------------------------------------------------- */

  const pollProvisioningStatus = useCallback(
    async (
      supabase: ReturnType<typeof createClient>,
      provisioningIds: { agentId: AgentId; provisioningId: string }[]
    ) => {
      const maxAttempts = 60; // up to ~2 minutes
      let attempts = 0;

      const checkAll = async (): Promise<boolean> => {
        attempts++;
        if (attempts > maxAttempts) return true; // give up after timeout

        const { data: rows } = await supabase
          .from("agent_provisioning")
          .select("id, agent_type, status, status_message")
          .in(
            "id",
            provisioningIds.map((p) => p.provisioningId)
          );

        if (!rows) return false;

        const newStatuses: ProvisioningStatus[] = provisioningIds.map((p) => {
          const row = rows.find((r: { id: string }) => r.id === p.provisioningId);
          if (!row) {
            return {
              agentId: p.agentId,
              step: "creating" as const,
              message: "Criando assistente...",
            };
          }

          const status = (row as { status: string }).status;
          const msg = (row as { status_message?: string }).status_message;

          if (status === "active" || status === "completed") {
            return {
              agentId: p.agentId,
              step: "active" as const,
              message: "Ativo!",
            };
          }
          if (status === "error" || status === "failed") {
            return {
              agentId: p.agentId,
              step: "error" as const,
              message: msg || "Erro no provisionamento",
            };
          }
          if (status === "configuring_phone" || status === "configuring") {
            return {
              agentId: p.agentId,
              step: "configuring" as const,
              message: "Configurando telefone...",
            };
          }
          return {
            agentId: p.agentId,
            step: "creating" as const,
            message: msg || "Criando assistente...",
          };
        });

        setProvisionStatuses(newStatuses);

        const allDone = newStatuses.every(
          (s) => s.step === "active" || s.step === "error"
        );
        return allDone;
      };

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const done = await checkAll();
        if (done) break;
        await new Promise((r) => setTimeout(r, 2000));
      }
    },
    []
  );

  async function activate() {
    const supabase = createClient();
    setIsProvisioning(true);

    // Initialize statuses
    setProvisionStatuses(
      formData.agentes.map((id) => ({
        agentId: id,
        step: "creating",
        message: "Criando assistente...",
      }))
    );

    try {
      // 1. Get or create organization
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let orgId: string;

      // Check if user already has an organization
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user?.id ?? "")
        .single();

      if (profile?.organization_id) {
        // Update existing org with new name
        await supabase
          .from("organizations")
          .update({
            name: formData.empresa,
            slug: formData.empresa
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") + "-" + Date.now().toString(36),
          })
          .eq("id", profile.organization_id);
        orgId = profile.organization_id;
      } else {
        // Create new organization
        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .insert({
            name: formData.empresa,
            slug: formData.empresa
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") + "-" + Date.now().toString(36),
          })
          .select()
          .single();

        if (orgError || !org) {
          console.error("Failed to create organization:", orgError);
          setIsProvisioning(false);
          return;
        }
        orgId = org.id;

        // Link user to org
        if (user) {
          await supabase
            .from("profiles")
            .update({ organization_id: orgId })
            .eq("id", user.id);
        }
      }

      // 3. Provision each agent
      const provisioningIds: { agentId: AgentId; provisioningId: string }[] = [];

      for (const agentId of formData.agentes) {
        const template = getTemplateByType(agentId);
        const config = formData.agentConfigs[agentId];
        if (!template || !config) continue;

        const systemPrompt = buildSystemPrompt(template, {
          empresa: formData.empresa,
          setor:
            SETORES.find((s) => s.value === formData.setor)?.label ??
            formData.setor,
          agente_nome: config.name,
          tom: config.tone,
          conhecimento:
            [formData.knowledge, formData.faq].filter(Boolean).join("\n\n") ||
            undefined,
        });

        const firstMessage = buildFirstMessage(template, {
          empresa: formData.empresa,
          agente_nome: config.name,
        });

        // Insert provisioning record
        const { data: prov, error: provError } = await supabase
          .from("agent_provisioning")
          .insert({
            organization_id: orgId,
            agent_type: agentId,
            agent_name: config.name,
            system_prompt: systemPrompt,
            first_message: firstMessage,
            voice_id: config.voiceId || null,
            voice_name: config.voiceName || null,
            tone: config.tone,
            config_json: { channels: formData.canais },
            status: "pending",
          })
          .select()
          .single();

        if (provError || !prov) {
          console.error("Failed to create provisioning:", provError);
          continue;
        }

        provisioningIds.push({
          agentId,
          provisioningId: prov.id,
        });

        // Call edge function to start provisioning
        fetch(`${supabaseUrl}/functions/v1/provision-agent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provisioning_id: prov.id,
            organization_id: orgId,
            agent_type: agentId,
            agent_name: config.name,
            system_prompt: systemPrompt,
            first_message: firstMessage,
            voice_id: config.voiceId || null,
            tone: config.tone,
            channels: formData.canais,
          }),
        }).catch((err) =>
          console.error("Edge function call failed:", err)
        );
      }

      // 4. Poll for status updates
      if (provisioningIds.length > 0) {
        await pollProvisioningStatus(supabase, provisioningIds);
      }

      // 5. Wait a moment then redirect
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/dashboard");
    } catch (err) {
      console.error("Activation error:", err);
      setIsProvisioning(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  function renderStep() {
    switch (currentStep) {
      case 1:
        return <Step1 data={formData} onChange={updateForm} />;
      case 2:
        return <Step2 data={formData} onChange={updateForm} />;
      case 3:
        return (
          <Step3
            data={formData}
            onChange={updateForm}
            voices={voices}
            voicesLoading={voicesLoading}
            voicesError={voicesError}
          />
        );
      case 4:
        return <Step4 data={formData} onChange={updateForm} />;
      case 5:
        return <Step5 data={formData} onChange={updateForm} />;
      case 6:
        return <Step6 data={formData} />;
      default:
        return null;
    }
  }

  return (
    <>
      {isProvisioning && <ProvisioningOverlay statuses={provisionStatuses} />}

      <div className="w-full max-w-2xl mx-auto">
        <ProgressBar current={currentStep} />

        <div className="relative bg-white/[0.07] border border-white/[0.12] rounded-3xl backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-black/50">
          {/* Top highlight — liquid glass */}
          <div
            className="absolute top-0 left-[8%] right-[8%] h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
          />
          {/* Inner glow */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)" }}
          />

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.06]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prev}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5B9BF3] text-sm font-medium text-white hover:bg-[#5B9BF3]/90 transition-colors cursor-pointer shadow-lg shadow-[#5B9BF3]/20"
              >
                Próximo
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={activate}
                disabled={isProvisioning}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#5B9BF3] text-sm font-semibold text-white hover:bg-[#5B9BF3]/90 transition-colors shadow-lg shadow-[#5B9BF3]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={16} />
                Ativar Agentes
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
