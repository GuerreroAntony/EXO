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
      className={`absolute z-30 hidden lg:block ${isRight ? "left-[50%] right-0 pr-[5%] pl-[4%]" : "left-0 right-[50%] pl-[5%] pr-[4%]"}`}
      style={{ opacity, transform: `translateX(${x}px)`, pointerEvents: pointerEvents ? "auto" : "none", top: "50%", marginTop: "-200px" }}
    >
      <div className="w-full max-w-lg">
      {/* Tag */}
      <div className="flex items-center gap-2 mb-5">
        <div className="h-px w-8" style={{ background: section.color }} />
        <p className="text-[11px] tracking-[0.3em] uppercase font-semibold" style={{ color: section.color }}>
          {section.tag}
        </p>
      </div>

      {/* Title */}
      <h2 className="text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-6">
        {section.title}
        <br />
        <span style={{ color: section.color }}>{section.highlight}</span>
      </h2>

      {/* Description */}
      <p className="text-[#999] text-lg leading-relaxed mb-10 max-w-lg">
        {section.desc}
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {section.features.map((f) => (
          <div key={f.text} className="flex items-center gap-3 text-[15px] text-[#ccc]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${section.color}15` }}>
              <f.icon size={18} style={{ color: section.color }} />
            </div>
            {f.text}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-5">
        <Link
          href={section.href}
          className="group flex items-center gap-2.5 px-8 py-3.5 text-white text-base font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02]"
          style={{ background: section.color }}
        >
          {section.cta}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/demo" className="text-[15px] text-[#666] hover:text-white transition-colors duration-300">
          Agendar demo
        </Link>
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

  // ── Phase 1: 0–500px — logo slides left, globe appears right ──
  const phase1 = Math.min(scrollY / 500, 1);

  // ── Phase 3+: pillar sections ──
  const phase3 = scrollY > 1000 ? Math.min((scrollY - 1000) / 800, 1) : 0;
  const ccFadeOut = scrollY > 3000 ? Math.min((scrollY - 3000) / 300, 1) : 0;
  const infFadeIn = scrollY > 3500 ? Math.min((scrollY - 3500) / 300, 1) : 0;
  const infFadeOut = scrollY > 5000 ? Math.min((scrollY - 5000) / 300, 1) : 0;
  const dwFadeIn = scrollY > 5500 ? Math.min((scrollY - 5500) / 300, 1) : 0;
  const dwFadeOut = scrollY > 7000 ? Math.min((scrollY - 7000) / 300, 1) : 0;
  const robFadeIn = scrollY > 7500 ? Math.min((scrollY - 7500) / 300, 1) : 0;

  // ── Logo ──
  const logoOpacity = 1 - phase3;
  const subtitleOpacity = Math.max(0, 1 - phase1 * 3);

  // ── Globe — starts right, moves left for DW/Robótica, back right for CC/Influencers ──
  const sphereOpacity = Math.min(Math.max((phase1 - 0.3) * 3, 0), 0.9);
  const phase4 = scrollY > 5500 ? Math.min((scrollY - 5500) / 800, 1) : 0;
  const globeToRight = phase3 * 8; // moves slightly right for CC/Influencers
  const globeToLeft = phase4 * -46; // crosses to left for DW/Robótica
  const globeX = 10 + globeToRight + globeToLeft;
  const globeScale = 1 + phase3 * 0.8;

  // ── Cards ──
  const cardsOpacity = Math.min(phase1 * 2.5, 1) * (1 - phase3);
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

  return (
    <div style={{ height: "1400vh" }}>
      <div className="h-screen flex items-center justify-center sticky top-0 overflow-hidden">

        {/* ── Globe ── */}
        <div
          className="absolute z-10"
          style={{
            width: "500px",
            height: "500px",
            opacity: sphereOpacity,
            transform: `translateX(${globeX}vw) scale(${globeScale})`,
            willChange: "transform, opacity",
          }}
        >
          <RotatingEarth width={500} height={500} />
        </div>

        {/* ── EXO Logo (fades out before globe) ── */}
        <div
          className="absolute z-20 pointer-events-none text-center"
          style={{
            opacity: subtitleOpacity,
            willChange: "opacity",
          }}
        >
          <h1 className="text-[clamp(4rem,14vw,12rem)] font-bold tracking-[-0.06em] leading-[0.85] text-white select-none">
            EXO
          </h1>
          <p className="mt-3 text-[clamp(1rem,2.5vw,1.6rem)] font-extralight text-white/35 tracking-[0.15em] uppercase">
            Expanding Human Operations
          </p>
        </div>

        {/* ── Description text (left of globe) ── */}
        <div
          className="absolute z-20 pointer-events-none hidden lg:block"
          style={{
            opacity: Math.min(Math.max((phase1 - 0.4) * 3, 0), 1) * (1 - phase3),
            top: "50%",
            left: "max(3rem, calc((100vw - 1200px) / 2 + 1rem))",
            right: "52%",
            transform: "translateY(-50%)",
            willChange: "opacity",
          }}
        >
          <p className="text-[clamp(1.8rem,3.5vw,3.2rem)] font-bold text-white leading-[1.1] tracking-tight">
            Empresa global
            <br />
            <span className="text-white/50">e multi-setor.</span>
          </p>
          <p className="mt-5 text-[16px] text-white/35 leading-relaxed">
            Levamos inteligência artificial para operações de vendas, atendimento, marketing e finanças em qualquer lugar do mundo.
          </p>
        </div>

        {/* ── Pillar Cards ── */}
        <div
          className="absolute z-20 bottom-[5%] left-0 right-0 flex justify-center px-[5%]"
          style={{
            opacity: cardsOpacity,
            transform: `translateY(${cardsY}px)`,
            pointerEvents: phase1 > 0.3 && phase3 < 0.5 ? "auto" : "none",
            willChange: "transform, opacity",
          }}
        >
          <div className="flex gap-4 max-w-5xl w-full">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className="group flex-1">
                  <div
                    className={`relative flex flex-col items-center justify-center gap-2.5 px-4 py-5 rounded-2xl border ${item.border} bg-white/[0.03] backdrop-blur-2xl transition-all duration-500 group-hover:bg-white/[0.07] group-hover:scale-[1.03] overflow-hidden`}
                    style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                  >
                    <div className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)` }} />
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110`}>
                      <Icon size={22} className={item.tw} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] text-white/80 font-semibold group-hover:text-white transition-colors">{item.label}</span>
                      {item.soon && (
                        <span className="text-[7px] font-mono uppercase tracking-widest text-white/25 bg-white/[0.06] px-1.5 py-0.5 rounded-full border border-white/[0.08]">
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

        {/* ── Pillar Sections ── */}
        <PillarSection section={sections[0]} opacity={ccOp} x={ccX} side="left" pointerEvents={ccOp > 0.5} />
        <PillarSection section={sections[1]} opacity={infOp} x={infX} side="left" pointerEvents={infOp > 0.5} />
        <PillarSection section={sections[2]} opacity={dwOp} x={dwX} side="right" pointerEvents={dwOp > 0.5} />
        <PillarSection section={sections[3]} opacity={robOp} x={robX} side="right" pointerEvents={robOp > 0.5} />

      </div>
    </div>
  );
}
