"use client";

import React from "react";
import Link from "next/link";
import { Bot, Brain, Users, Cog, type LucideIcon } from "lucide-react";

interface CardData {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
}

const defaultCards: CardData[] = [
  {
    title: "Call Center",
    desc: "Agentes de voz e WhatsApp com IA que atendem, agendam, cobram e escalam — em português natural.",
    href: "/callcenter",
    icon: Bot,
  },
  {
    title: "Influencers Virtuais",
    desc: "Influenciadores digitais com IA para redes sociais, marketing e criação de conteúdo.",
    href: "/inteligencia-virtual",
    icon: Brain,
  },
  {
    title: "Digital Workers",
    desc: "Trabalhadores digitais autônomos que executam processos complexos de ponta a ponta.",
    href: "/digital-workers",
    icon: Users,
  },
  {
    title: "Robótica",
    desc: "Automação física inteligente para logística, manufatura e operações industriais.",
    href: "/robotica",
    icon: Cog,
    soon: true,
  },
];

interface SkewCardsProps {
  cards?: CardData[];
}

export default function SkewCards({ cards = defaultCards }: SkewCardsProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(({ title, desc, href, icon: Icon, soon }, idx) => (
        <Link key={idx} href={href} className="group block">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500 flex flex-col h-full">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center mb-6">
              <Icon className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors duration-500" />
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
              {soon && (
                <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase bg-white/5 rounded-full text-white/25 border border-white/5">
                  Soon
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-white/35 leading-relaxed flex-1">
              {desc}
            </p>

            {/* CTA */}
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 text-sm text-white/30 group-hover:text-white/60 transition-colors duration-500">
                Explorar <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
