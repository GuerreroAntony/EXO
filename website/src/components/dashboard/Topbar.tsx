"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Phone } from "lucide-react";

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
    <header className="h-14 border-b border-[#2a2a2a] bg-[#111] px-4 lg:px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[#555] hover:text-[#999] transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-medium text-white">{title}</h1>
        {pathname !== "/dashboard/hub" && (
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-lg bg-[#1e1e1e] border-0">
            <Phone size={10} className="text-[#5B9BF3]" />
            <span className="text-[10px] font-medium text-[#888]">Call Center</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-[#555] hover:text-[#999] transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#5B9BF3] rounded-full" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[13px] text-[#999]">Dr. Ricardo</span>
        </div>
      </div>
    </header>
  );
}
