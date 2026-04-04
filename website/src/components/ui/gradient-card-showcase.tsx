"use client";

import React from "react";
import Link from "next/link";
import { Bot, Brain, Users, Cog, type LucideIcon } from "lucide-react";

interface SkewCard {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  number: string;
  gradientFrom: string;
  gradientTo: string;
  soon?: boolean;
}

const defaultCards: SkewCard[] = [
  {
    title: "Call Center",
    desc: "Agentes de voz e WhatsApp com IA que atendem, agendam, cobram e escalam — em português natural.",
    href: "/callcenter",
    icon: Bot,
    number: "01",
    gradientFrom: "#ffffff",
    gradientTo: "#d4d4d4",
  },
  {
    title: "Influencers Virtuais",
    desc: "Influenciadores digitais com IA para redes sociais, marketing e criação de conteúdo.",
    href: "/inteligencia-virtual",
    icon: Brain,
    number: "02",
    gradientFrom: "#ffffff",
    gradientTo: "#d4d4d4",
  },
  {
    title: "Digital Workers",
    desc: "Trabalhadores digitais autônomos que executam processos complexos de ponta a ponta.",
    href: "/digital-workers",
    icon: Users,
    number: "03",
    gradientFrom: "#ffffff",
    gradientTo: "#d4d4d4",
  },
  {
    title: "Robótica",
    desc: "Automação física inteligente para logística, manufatura e operações industriais.",
    href: "/robotica",
    icon: Cog,
    number: "04",
    gradientFrom: "#ffffff",
    gradientTo: "#d4d4d4",
    soon: true,
  },
];

interface SkewCardsProps {
  cards?: SkewCard[];
}

export default function SkewCards({ cards = defaultCards }: SkewCardsProps) {
  return (
    <>
      <div className="flex justify-center items-center flex-wrap gap-y-12">
        {cards.map(({ title, desc, href, icon: Icon, number, gradientFrom, gradientTo, soon }, idx) => (
          <Link key={idx} href={href} className="group block">
            <div className="relative w-[300px] h-[380px] m-[20px_20px] transition-all duration-500">
              {/* Skewed gradient panels */}
              <span
                className="absolute top-0 left-[50px] w-1/2 h-full rounded-2xl transform skew-x-[15deg] opacity-[0.15] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)] group-hover:opacity-[0.25]"
                style={{
                  background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
                }}
              />
              <span
                className="absolute top-0 left-[50px] w-1/2 h-full rounded-2xl transform skew-x-[15deg] blur-[40px] opacity-[0.10] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)] group-hover:opacity-[0.15]"
                style={{
                  background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
                }}
              />

              {/* Animated blur blobs */}
              <span className="pointer-events-none absolute inset-0 z-10">
                <span className="absolute top-0 left-0 w-0 h-0 rounded-2xl opacity-0 bg-[rgba(255,255,255,0.08)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-all duration-500 animate-blob group-hover:top-[-40px] group-hover:left-[40px] group-hover:w-[80px] group-hover:h-[80px] group-hover:opacity-100" />
                <span className="absolute bottom-0 right-0 w-0 h-0 rounded-2xl opacity-0 bg-[rgba(255,255,255,0.08)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-all duration-500 animation-delay-1000 animate-blob group-hover:bottom-[-40px] group-hover:right-[40px] group-hover:w-[80px] group-hover:h-[80px] group-hover:opacity-100" />
              </span>

              {/* Content card */}
              <div className="relative z-20 left-0 h-full p-[30px_32px] bg-[rgba(255,255,255,0.04)] backdrop-blur-[16px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl text-white transition-all duration-500 group-hover:left-[-25px] group-hover:p-[40px_32px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-mono text-white/20">{number}</span>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:border-white/20 transition-all duration-500">
                    <Icon className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors duration-500" />
                  </div>
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                  {soon && (
                    <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase bg-white/5 rounded-full text-white/25 border border-white/5">
                      Soon
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-white/40 leading-relaxed flex-1 group-hover:text-white/60 transition-colors duration-500">
                  {desc}
                </p>

                {/* CTA */}
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 text-[12px] font-medium text-white/30 group-hover:text-white/70 transition-colors duration-500 tracking-wide">
                    Explorar →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translate(-10px, -10px); }
        }
        .animate-blob { animation: blob 3s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: -1.5s; }
      `}</style>
    </>
  );
}
