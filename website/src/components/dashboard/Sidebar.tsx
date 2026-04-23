"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Users,
  Phone,
  CalendarDays,
  CreditCard,
  MessageSquare,
  SlidersHorizontal,
  LogOut,
  X,
} from "lucide-react";

const navGroups = [
  {
    label: null,
    items: [
      { label: "Produtos", icon: LayoutGrid, href: "/dashboard/hub" },
    ],
  },
  {
    label: "PRINCIPAL",
    items: [
      { label: "Visão Geral", icon: Home, href: "/dashboard" },
      { label: "Agentes", icon: Users, href: "/dashboard/agentes" },
      { label: "Ligações", icon: Phone, href: "/dashboard/atendimentos" },
    ],
  },
  {
    label: "OPERAÇÕES",
    items: [
      { label: "Agendamentos", icon: CalendarDays, href: "/dashboard/agendamentos" },
      { label: "Financeiro", icon: CreditCard, href: "/dashboard/financeiro" },
      { label: "Tickets", icon: MessageSquare, href: "/dashboard/tickets" },
    ],
  },
  {
    label: "CONFIGURAÇÃO",
    items: [
      { label: "Configurações", icon: SlidersHorizontal, href: "/dashboard/configuracoes" },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isHubPage = pathname === "/dashboard/hub";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-56 flex flex-col
          bg-[#111] border-r border-[#2a2a2a]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-5">
          <Link href="/dashboard" className="text-white font-bold text-xl tracking-tight">
            EXO
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-[#555] hover:text-[#999] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-3 overflow-y-auto">
          {navGroups.map((group, gi) => {
            // Hide nav groups (except Produtos) when on hub page
            if (isHubPage && gi > 0) return null;

            return (
              <div key={group.label ?? "top"} className="mb-1">
                {/* Section label with line */}
                {group.label && (
                  <div className="flex items-center gap-3 px-2 pt-5 pb-2">
                    <span className="text-[10px] font-medium tracking-[0.12em] text-[#444] uppercase whitespace-nowrap">
                      {group.label}
                    </span>
                    <div className="flex-1 h-px bg-[#1e1e1e]" />
                  </div>
                )}

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
                          flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-150
                          ${active
                            ? "bg-[#5B9BF3] text-white font-medium shadow-[0_2px_8px_rgba(91,155,243,0.3)]"
                            : "text-[#666] font-normal hover:text-white hover:bg-[#1a1a1a]"
                          }
                        `}
                      >
                        <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center text-[#888] text-[10px] font-semibold">
              DR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-white font-medium truncate">Dr. Ricardo</p>
              <p className="text-[10px] text-[#555]">Clínica Sorriso</p>
            </div>
          </div>
          <button
            onClick={async () => {
              const { createClient } = await import("@/lib/supabase/client");
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 text-[#555] hover:text-[#999] text-[12px] transition-colors w-full px-1 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
