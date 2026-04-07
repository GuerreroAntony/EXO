"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  PhoneCall,
  Calendar,
  Wallet,
  Ticket,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const navGroups = [
  {
    label: "PRINCIPAL",
    items: [
      { label: "Visão Geral", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Agentes", icon: Bot, href: "/dashboard/agentes" },
      { label: "Ligações", icon: PhoneCall, href: "/dashboard/atendimentos" },
    ],
  },
  {
    label: "OPERAÇÕES",
    items: [
      { label: "Agendamentos", icon: Calendar, href: "/dashboard/agendamentos" },
      { label: "Financeiro", icon: Wallet, href: "/dashboard/financeiro" },
      { label: "Tickets", icon: Ticket, href: "/dashboard/tickets" },
    ],
  },
  {
    label: "CONFIGURAÇÃO",
    items: [
      { label: "Configurações", icon: Settings, href: "/dashboard/configuracoes" },
    ],
  },
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
          bg-[#0d0d0d] border-r border-[#1e1e1e]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#1e1e1e]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5B9BF3]/20 flex items-center justify-center">
              <span className="text-[#5B9BF3] font-bold text-sm font-mono">EX</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">EXO</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-[#666] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-[#555]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200
                        ${
                          active
                            ? "bg-[#5B9BF3]/10 text-[#5B9BF3]"
                            : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                        }
                      `}
                    >
                      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[#1e1e1e]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#5B9BF3]/15 flex items-center justify-center text-[#5B9BF3] text-xs font-bold font-mono">
              DR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">Dr. Ricardo</p>
              <p className="text-[11px] text-[#555] font-mono">Clínica Sorriso</p>
            </div>
          </div>
          <button
            onClick={async () => {
              const { createClient } = await import("@/lib/supabase/client");
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="flex items-center gap-2 text-[#555] hover:text-[#aaa] text-sm transition-colors w-full px-1 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
