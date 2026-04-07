"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/dashboard/agentes": "Agentes",
  "/dashboard/atendimentos": "Ligações",
  "/dashboard/agendamentos": "Agendamentos",
  "/dashboard/financeiro": "Financeiro",
  "/dashboard/tickets": "Tickets",
  "/dashboard/configuracoes": "Configurações",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();

  // Match exact or prefix for nested routes
  const title = pageTitles[pathname]
    || Object.entries(pageTitles).find(([k]) => pathname.startsWith(k) && k !== "/dashboard")?.[1]
    || "Dashboard";

  return (
    <header className="h-16 border-b border-[#1e1e1e] px-4 lg:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[#666] hover:text-white transition-colors"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-[#666] hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#5B9BF3] rounded-full" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-[#999]">Dr. Ricardo</span>
        </div>
      </div>
    </header>
  );
}
