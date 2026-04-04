const statusColors: Record<string, { bg: string; text: string }> = {
  agendado: { bg: "bg-blue-500/15", text: "text-blue-400" },
  confirmado: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  cancelado: { bg: "bg-red-500/15", text: "text-red-400" },
  realizado: { bg: "bg-white/10", text: "text-white/70" },
  pendente: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  pago: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  atrasado: { bg: "bg-red-500/15", text: "text-red-400" },
  aberto: { bg: "bg-blue-500/15", text: "text-blue-400" },
  resolvido: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  fechado: { bg: "bg-white/10", text: "text-white/40" },
  ativo: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  pausado: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  erro: { bg: "bg-red-500/15", text: "text-red-400" },
  provisionando: { bg: "bg-blue-500/15", text: "text-blue-400" },
  baixa: { bg: "bg-blue-500/15", text: "text-blue-400" },
  media: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  alta: { bg: "bg-orange-500/15", text: "text-orange-400" },
  urgente: { bg: "bg-red-500/15", text: "text-red-400" },
  voz: { bg: "bg-violet-500/15", text: "text-violet-400" },
  whatsapp: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  // Admin statuses — leads
  novo: { bg: "bg-blue-500/15", text: "text-blue-400" },
  contactado: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  convertido: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  perdido: { bg: "bg-red-500/15", text: "text-red-400" },
  // Admin statuses — plans
  starter: { bg: "bg-blue-500/15", text: "text-blue-400" },
  pro: { bg: "bg-purple-500/15", text: "text-purple-400" },
  enterprise: { bg: "bg-orange-500/15", text: "text-orange-400" },
  trial: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  // Admin statuses — roles
  owner: { bg: "bg-orange-500/15", text: "text-orange-400" },
  admin: { bg: "bg-blue-500/15", text: "text-blue-400" },
  member: { bg: "bg-white/10", text: "text-white/70" },
  viewer: { bg: "bg-white/10", text: "text-white/40" },
  // Escalation & knowledge statuses
  aguardando: { bg: "bg-orange-500/15", text: "text-orange-400" },
  "em atendimento": { bg: "bg-blue-500/15", text: "text-blue-400" },
  publicado: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  rascunho: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  modificado: { bg: "bg-purple-500/15", text: "text-purple-400" },
  escalonado: { bg: "bg-orange-500/15", text: "text-orange-400" },
  online: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  atendendo: { bg: "bg-blue-500/15", text: "text-blue-400" },
  offline: { bg: "bg-white/10", text: "text-white/40" },
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const colors = statusColors[key] || { bg: "bg-white/10", text: "text-white/50" };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium capitalize
        ${colors.bg} ${colors.text}
        ${size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"}
      `}
    >
      {status}
    </span>
  );
}
