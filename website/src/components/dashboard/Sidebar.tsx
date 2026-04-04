"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Users,
  Headphones,
  Calendar,
  CreditCard,
  BarChart3,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const navItems = [
  { label: "Visão Geral", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Agentes", icon: Bot, href: "/dashboard/agentes" },
  { label: "Contatos", icon: Users, href: "/dashboard/contatos" },
  { label: "Atendimentos", icon: Headphones, href: "/dashboard/atendimentos" },
  { label: "Agendamentos", icon: Calendar, href: "/dashboard/agendamentos" },
  { label: "Financeiro", icon: CreditCard, href: "/dashboard/financeiro" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Tickets", icon: MessageSquare, href: "/dashboard/tickets" },
  { label: "Escalonamentos", icon: AlertTriangle, href: "/dashboard/escalonamentos", badge: 3 },
  { label: "Conhecimento", icon: BookOpen, href: "/dashboard/conhecimento" },
  { label: "Configurações", icon: Settings, href: "/dashboard/configuracoes" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col
          bg-white/[0.02] border-r border-white/5
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5B9BF3]/20 flex items-center justify-center">
              <span className="text-[#5B9BF3] font-bold text-sm font-mono">EX</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">EXO</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-white/40 hover:text-white/70 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                  ${
                    active
                      ? "bg-white/[0.06] text-white border-l-2 border-[#5B9BF3] pl-[10px]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                  }
                `}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {"badge" in item && item.badge ? (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#5B9BF3]/20 flex items-center justify-center text-[#5B9BF3] text-xs font-bold font-mono">
              DR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">Dr. Ricardo</p>
              <p className="text-[11px] text-white/30 font-mono">Clínica Sorriso</p>
            </div>
          </div>
          <button
            onClick={async () => {
              const { createClient } = await import("@/lib/supabase/client");
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors w-full px-1 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
