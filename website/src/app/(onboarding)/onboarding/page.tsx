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
  "Revisao",
];

const SETORES = [
  { value: "", label: "Selecione..." },
  { value: "saude", label: "Saude" },
  { value: "educacao", label: "Educacao" },
  { value: "varejo", label: "Varejo" },
  { value: "servicos", label: "Servicos" },
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
  { id: "cobranca", label: "Cobranca", desc: "Negociacao de pagamentos", icon: CreditCard },
  { id: "agendamento", label: "Agendamento", desc: "Marca e confirma consultas", icon: Calendar },
];

const CANAIS: {
  id: ChannelId;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "whatsapp", label: "WhatsApp", desc: "Atendimento via WhatsApp Business", icon: MessageCircle },
  { id: "voz", label: "Voz", desc: "Ligacoes telefonicas com IA", icon: Phone },
];

const TONES: { id: ToneId; label: string }[] = [
  { id: "amigavel", label: "Amigavel" },
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
  "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors";

const labelClass =
  "block text-[12px] font-mono text-white/40 uppercase tracking-wider mb-2";

function ProgressBar({ current }: { current: number }) {
  const progress = ((current - 1) / (TOTAL_STEPS - 1)) * 100;
  return (
    <div className="mb-8">
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
                  ? "text-white"
                  : isDone
                    ? "text-[#5B9BF3]"
                    : "text-white/20"
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>
      <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#5B9BF3] rounded-full"
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
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo a EXO</h1>
        <p className="text-white/50 text-sm">
          Vamos configurar sua operacao em poucos minutos.
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
          Quais agentes voce precisa?
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
          Como seus clientes vao falar com voce?
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Ensine seus agentes
        </h1>
        <p className="text-white/50 text-sm">
          Adicione informacoes para os agentes usarem nas conversas.
        </p>
      </div>

      <div>
        <label className={labelClass}>Informacoes da empresa</label>
        <textarea
          value={data.knowledge}
          onChange={(e) => onChange({ knowledge: e.target.value })}
          placeholder="Horario de funcionamento, endereco, servicos oferecidos..."
          rows={4}
          className={inputClass + " resize-none"}
        />
      </div>

      <div>
        <label className={labelClass}>Perguntas frequentes</label>
        <textarea
          value={data.faq}
          onChange={(e) => onChange({ faq: e.target.value })}
          placeholder={"Quais formas de pagamento aceitam?\nQual o prazo de entrega?"}
          rows={4}
          className={inputClass + " resize-none"}
        />
      </div>

      <p className="text-xs text-white/30 italic">
        Voce pode editar isso depois no dashboard.
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
          Revise suas configuracoes antes de ativar.
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
      // 1. Create organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: formData.empresa,
          slug: formData.empresa
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        })
        .select()
        .single();

      if (orgError || !org) {
        console.error("Failed to create organization:", orgError);
        setIsProvisioning(false);
        return;
      }

      // 2. Update user profile with org id
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ organization_id: org.id })
          .eq("id", user.id);
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
            organization_id: org.id,
            agent_type: agentId,
            agent_name: config.name,
            system_prompt: systemPrompt,
            first_message: firstMessage,
            voice_id: config.voiceId || null,
            tone: config.tone,
            channels: formData.canais,
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
            organization_id: org.id,
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

      <div className="w-full max-w-lg mx-auto">
        <ProgressBar current={currentStep} />

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
        <div className="flex items-center justify-between mt-10">
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
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.08] text-sm font-medium text-white hover:bg-white/[0.12] transition-colors cursor-pointer"
            >
              Proximo
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
    </>
  );
}
