"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Bot, Brain, Users, Cog, Phone, Headphones, Calendar, DollarSign, ArrowRight, Sparkles } from "lucide-react";

const RotatingEarth = dynamic(
  () => import("@/components/ui/wireframe-dotted-globe"),
  { ssr: false }
);

/* ───── Pillar Data ───── */
const pillars = [
  { icon: Phone, label: "Call Center", desc: "Agentes de voz com IA que atendem, agendam e cobram 24/7", href: "/callcenter", color: "#5B9BF3", tw: "text-[#5B9BF3]", bg: "bg-[#5B9BF3]/10", border: "border-[#5B9BF3]/25 hover:border-[#5B9BF3]/50" },
  { icon: Sparkles, label: "Influencers Virtuais", desc: "Personalidades digitais que engajam e criam conteúdo", href: "/inteligencia-virtual", color: "#22d3ee", tw: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/25 hover:border-cyan-400/50" },
  { icon: Users, label: "Digital Workers", desc: "Funcionários digitais que automatizam processos complexos", href: "/digital-workers", color: "#a78bfa", tw: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/25 hover:border-violet-400/50" },
  { icon: Cog, label: "Robótica", desc: "Automação física inteligente para operações", href: "/robotica", color: "#34d399", tw: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/25 hover:border-emerald-400/50", soon: true },
];

const sections = [
  {
    tag: "Call Center IA", title: "Atendimento que", highlight: "nunca dorme.", color: "#5B9BF3",
    desc: "Agentes de IA que atendem ligações, resolvem problemas, agendam consultas e cobram inadimplentes — tudo com voz natural em português, 24 horas por dia.",
    features: [
      { icon: Phone, text: "Atendimento 24/7 por voz" },
      { icon: Headphones, text: "SAC inteligente com empatia" },
      { icon: Calendar, text: "Agendamento automático" },
      { icon: DollarSign, text: "Cobrança e negociação" },
    ],
    cta: "Conhecer o Call Center", href: "/callcenter",
  },
  {
    tag: "Influencers Virtuais", title: "Influência", highlight: "que nunca para.", color: "#22d3ee",
    desc: "Crie influencers virtuais com personalidade própria que produzem conteúdo, engajam seguidores e representam sua marca em todas as plataformas.",
    features: [
      { icon: Brain, text: "Personalidade única" },
      { icon: Users, text: "Engajamento 24/7" },
      { icon: Bot, text: "Conteúdo automático" },
      { icon: Cog, text: "Escala sem limites" },
    ],
    cta: "Conhecer Influencers", href: "/inteligencia-virtual",
  },
  {
    tag: "Digital Workers", title: "Funcionários", highlight: "que não param.", color: "#a78bfa",
    desc: "Trabalhadores digitais autônomos que executam processos complexos — análise de dados, automação de fluxos e tomada de decisão, sem supervisão humana.",
    features: [
      { icon: Bot, text: "Automação de processos" },
      { icon: Brain, text: "Análise de dados" },
      { icon: Users, text: "Trabalho em equipe" },
      { icon: Cog, text: "Integração com sistemas" },
    ],
    cta: "Conhecer Digital Workers", href: "/digital-workers",
  },
  {
    tag: "Robótica", title: "Automação", highlight: "física inteligente.", color: "#34d399",
    desc: "Robôs inteligentes para logística, manufatura e operações — controlados por IA, integrados ao seu sistema, trabalhando lado a lado com humanos.",
    features: [
      { icon: Cog, text: "Logística automatizada" },
      { icon: Bot, text: "Manufatura inteligente" },
      { icon: Brain, text: "IA embarcada" },
      { icon: Users, text: "Colaboração humano-robô" },
    ],
    cta: "Explorar Robótica", href: "/robotica",
  },
];

/* ───── Section Component ───── */
function PillarSection({ section, opacity, x, side, pointerEvents }: {
  section: typeof sections[0]; opacity: number; x: number; side: "left" | "right"; pointerEvents: boolean;
}) {
  const isRight = side === "right";
  return (
    <div
      className="absolute inset-0 z-30 hidden lg:flex items-center"
      style={{ opacity, transform: `translateX(${x}px)`, pointerEvents: pointerEvents ? "auto" : "none" }}
    >
      <div className="max-w-6xl w-full mx-auto px-6">
        <div className={`max-w-[480px] ${isRight ? "ml-auto" : ""}`}>

          {/* Tag */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: section.color }} />
            <p className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: section.color }}>
              {section.tag}
            </p>
          </div>

          {/* Title */}
          <h2 className="text-[clamp(2.8rem,5vw,4.2rem)] font-bold text-white leading-[1.05] tracking-tight mb-6">
            {section.title}
            <br />
            <span style={{ color: section.color }}>{section.highlight}</span>
          </h2>

          {/* Description */}
          <p className="text-white/30 text-[17px] leading-[1.7] mb-10 max-w-[420px]">
            {section.desc}
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-12">
            {section.features.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-[15px] text-white/50">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white/[0.04]">
                  <f.icon size={16} style={{ color: section.color }} strokeWidth={1.5} />
                </div>
                {f.text}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-6">
            <Link
              href={section.href}
              className="group flex items-center gap-2.5 bg-white text-black font-medium text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5"
            >
              {section.cta}
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/demo" className="text-[14px] text-white/25 hover:text-white/60 transition-colors duration-300">
              Agendar demo
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ───── Main Component ───── */
export function ScrollingHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Phase 1: 0–600px — logo fades, globe appears, text appears ──
  const phase1 = Math.min(scrollY / 600, 1);

  // ── Phase 2: 1400–1800px — hero text fades out (hero visible 600→1400 = 800px) ──
  const heroFadeOut = scrollY > 1400 ? Math.min((scrollY - 1400) / 400, 1) : 0;

  // ── Phase 3: 2000–2800px — pillar sections fade in ──
  const phase3 = scrollY > 2000 ? Math.min((scrollY - 2000) / 800, 1) : 0;
  const ccFadeOut = scrollY > 4200 ? Math.min((scrollY - 4200) / 300, 1) : 0;
  const infFadeIn = scrollY > 4700 ? Math.min((scrollY - 4700) / 300, 1) : 0;
  const infFadeOut = scrollY > 6200 ? Math.min((scrollY - 6200) / 300, 1) : 0;
  const dwFadeIn = scrollY > 6700 ? Math.min((scrollY - 6700) / 300, 1) : 0;
  const dwFadeOut = scrollY > 8200 ? Math.min((scrollY - 8200) / 300, 1) : 0;
  const robFadeIn = scrollY > 8700 ? Math.min((scrollY - 8700) / 300, 1) : 0;

  // ── Logo ──
  const logoOpacity = 1 - phase3;
  const subtitleOpacity = Math.max(0, 1 - phase1 * 3);

  // ── Globe — centered in viewport with vw offset ──
  const sphereOpacity = Math.min(Math.max((phase1 - 0.3) * 3, 0), 0.9);
  const phase4 = scrollY > 6700 ? Math.min((scrollY - 6700) / 800, 1) : 0;
  // Initial: 23vw → right edge at navbar right
  // CC/Influencers (phase3): eases to 17vw → globe fits inside viewport at scale 1.8
  // DW/Robótica (phase4): mirrors to -17vw → globe fits inside viewport on left
  const globeToRight = phase3 * -6;
  const globeToLeft = phase4 * -34;
  const globeX = 23 + globeToRight + globeToLeft;
  const globeScale = 1 + phase3 * 0.8;

  // ── Cards ──
  const cardsOpacity = Math.min(phase1 * 2.5, 1) * (1 - heroFadeOut);
  const cardsY = (1 - Math.min(phase1 * 2, 1)) * 40;

  // ── Pillar opacities ──
  const ccOp = phase3 * (1 - ccFadeOut);
  const ccX = (1 - phase3) * -40;
  const infOp = infFadeIn * (1 - infFadeOut);
  const infX = (1 - infFadeIn) * -40;
  const dwOp = dwFadeIn * (1 - dwFadeOut);
  const dwX = (1 - dwFadeIn) * 40;
  const robOp = robFadeIn;
  const robX = (1 - robFadeIn) * 40;

  const heroTextOpacity = Math.min(Math.max((phase1 - 0.4) * 3, 0), 1) * (1 - heroFadeOut);

  return (
    <div style={{ height: "1400vh" }}>
      <div className="h-screen sticky top-0 overflow-hidden">

        {/* ── EXO Logo (fades out before globe) ── */}
        <div
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
          style={{ opacity: subtitleOpacity, willChange: "opacity" }}
        >
          <div className="text-center">
            <h1 className="text-[clamp(4rem,14vw,12rem)] font-bold tracking-[-0.06em] leading-[0.85] text-white select-none">
              EXO
            </h1>
            <p className="mt-3 text-[clamp(1rem,2.5vw,1.6rem)] font-extralight text-white/35 tracking-[0.15em] uppercase">
              Expanding Human Operations
            </p>
          </div>
        </div>

        {/* ── Globe — centered in viewport, offset with vw ── */}
        <div
          className="absolute z-10"
          style={{
            width: "500px",
            height: "500px",
            opacity: sphereOpacity,
            top: "calc(50% + 10px)",
            left: "50%",
            transform: `translate(-50%, -50%) translateX(${globeX}vw) scale(${globeScale})`,
            willChange: "transform, opacity",
          }}
        >
          <RotatingEarth width={500} height={500} />
        </div>

        {/* ── Hero content — navbar-aligned container ── */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: heroTextOpacity, willChange: "opacity" }}
        >
          <div className="max-w-6xl w-full px-6 h-full mx-auto flex items-center">
            <div className="hidden lg:block max-w-[500px] pt-6">
              <h2 className="text-[clamp(3rem,5.5vw,4.8rem)] font-bold text-white leading-[1.05] tracking-[-0.02em]">
                Empresa global
                <br />
                <span className="text-white/35">e multi-setor.</span>
              </h2>
              <p className="mt-8 text-[17px] text-white/25 leading-[1.7] max-w-[400px]">
                Levamos inteligência artificial para operações de vendas, atendimento, marketing e finanças em qualquer lugar do mundo.
              </p>
            </div>
          </div>
        </div>

        {/* ── Pillar Cards — navbar-aligned, Apple minimal ── */}
        <div
          className="absolute z-20 inset-x-0"
          style={{
            bottom: "clamp(32px, 6vh, 64px)",
            opacity: cardsOpacity,
            transform: `translateY(${cardsY}px)`,
            pointerEvents: phase1 > 0.3 && heroFadeOut < 0.5 ? "auto" : "none",
            willChange: "transform, opacity",
          }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-4 gap-5">
              {pillars.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href} className="group">
                    <div className="relative flex flex-col items-center justify-center gap-3 py-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 group-hover:bg-white/[0.05] group-hover:border-white/[0.12] group-hover:-translate-y-0.5">
                      <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110`}>
                        <Icon size={20} className={item.tw} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] text-white/60 font-medium group-hover:text-white/90 transition-colors whitespace-nowrap">
                          {item.label}
                        </span>
                        {item.soon && (
                          <span className="text-[6px] font-mono uppercase tracking-widest text-white/15 bg-white/[0.04] px-1.5 py-0.5 rounded-full border border-white/[0.06]">
                            Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Pillar Sections ── */}
        <PillarSection section={sections[0]} opacity={ccOp} x={ccX} side="left" pointerEvents={ccOp > 0.5} />
        <PillarSection section={sections[1]} opacity={infOp} x={infX} side="left" pointerEvents={infOp > 0.5} />
        <PillarSection section={sections[2]} opacity={dwOp} x={dwX} side="right" pointerEvents={dwOp > 0.5} />
        <PillarSection section={sections[3]} opacity={robOp} x={robX} side="right" pointerEvents={robOp > 0.5} />

      </div>
    </div>
  );
}
