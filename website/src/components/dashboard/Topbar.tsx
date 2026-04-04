"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/dashboard/agentes": "Agentes",
  "/dashboard/contatos": "Contatos",
  "/dashboard/atendimentos": "Atendimentos",
  "/dashboard/agendamentos": "Agendamentos",
  "/dashboard/financeiro": "Financeiro",
  "/dashboard/analytics": "Analytics",
  "/dashboard/tickets": "Tickets",
  "/dashboard/escalonamentos": "Escalonamentos",
  "/dashboard/conhecimento": "Base de Conhecimento",
  "/dashboard/configuracoes": "Configurações",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="h-16 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white/40 hover:text-white/70 transition-colors"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-white/40 hover:text-white/70 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#5B9BF3] rounded-full" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-white/50">Dr. Ricardo</span>
        </div>
      </div>
    </header>
  );
}
