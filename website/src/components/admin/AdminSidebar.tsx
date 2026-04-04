"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Bot,
  UserPlus,
  Users,
  Headphones,
  CreditCard,
  ArrowLeft,
  X,
} from "lucide-react";

const navItems = [
  { label: "Visão Geral", icon: LayoutDashboard, href: "/admin" },
  { label: "Organizações", icon: Building2, href: "/admin/organizacoes" },
  { label: "Agentes", icon: Bot, href: "/admin/agentes" },
  { label: "Leads", icon: UserPlus, href: "/admin/leads" },
  { label: "Usuários", icon: Users, href: "/admin/usuarios" },
  { label: "Atendimentos", icon: Headphones, href: "/admin/atendimentos" },
  { label: "Financeiro", icon: CreditCard, href: "/admin/financeiro" },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
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
        {/* Logo + Admin badge */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F97316]/20 flex items-center justify-center">
              <span className="text-[#F97316] font-bold text-sm font-mono">EX</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">EXO</span>
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#F97316]/15 text-[#F97316] tracking-wider">
              Admin
            </span>
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
                      ? "bg-white/[0.06] text-white border-l-2 border-[#F97316] pl-[10px]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors w-full px-1"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
