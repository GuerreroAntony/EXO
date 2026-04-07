"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Bot, Brain, Users, Cog, Phone, Headphones, Calendar, DollarSign, ArrowRight } from "lucide-react";

const RotatingEarth = dynamic(
  () => import("@/components/ui/wireframe-dotted-globe"),
  { ssr: false }
);

const callcenterFeatures = [
  { icon: Phone, text: "Atendimento 24/7 por voz" },
  { icon: Headphones, text: "SAC inteligente com empatia" },
  { icon: Calendar, text: "Agendamento automático" },
  { icon: DollarSign, text: "Cobrança e negociação" },
];

export function ScrollingHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Phase 1: 0–500px — logo fades, globe appears, row1 slides out
  const phase1 = Math.min(scrollY / 500, 1);
  // Phase 3: 1000–1800px — globe moves left, Call Center appears right
  const phase3 = scrollY > 1000 ? Math.min((scrollY - 1000) / 800, 1) : 0;
  // Call Center visible: 1800–3000px (stays), then fades out 3000–3300px
  const callcenterFadeOut = scrollY > 3000 ? Math.min((scrollY - 3000) / 300, 1) : 0;
  // Influencers fades in: 3500–3800px (gap ensures no overlap)
  const influencersFadeIn = scrollY > 3500 ? Math.min((scrollY - 3500) / 300, 1) : 0;
  // Influencers fades out: 5000–5300px
  const influencersFadeOut = scrollY > 5000 ? Math.min((scrollY - 5000) / 300, 1) : 0;
  // Phase 4: 5500–6300px — globe moves to right
  const phase4 = scrollY > 5500 ? Math.min((scrollY - 5500) / 800, 1) : 0;
  // Digital Workers fades in: 5500–5800px
  const dwFadeIn = scrollY > 5500 ? Math.min((scrollY - 5500) / 300, 1) : 0;
  // Digital Workers fades out: 7000–7300px
  const dwFadeOut = scrollY > 7000 ? Math.min((scrollY - 7000) / 300, 1) : 0;
  // Robótica fades in: 7500–7800px
  const roboticaFadeIn = scrollY > 7500 ? Math.min((scrollY - 7500) / 300, 1) : 0;

  const logoOpacity = Math.max(0, 1 - phase1 * 1.5);
  const logoScale = 1 - phase1 * 0.5;
  const subtitleOpacity = Math.max(0, 1 - phase1 * 4);
  const sphereOpacity = Math.min(phase1 * 2, 0.85);

  // Pillar cards below globe
  const cardsOpacity = Math.min(phase1 * 2.5, 1) * (1 - phase3);

  // Globe: left for Call Center + Influencers, then right for DW + Robótica
  const globeToLeft = phase3 * -40;
  const globeToRight = phase4 * 80;
  const globeX = globeToLeft + globeToRight;
  const globeScale = 1 + phase3 * 0.8;

  // Call Center: fades in with phase3, fades out later
  const callcenterOpacity = phase3 * (1 - callcenterFadeOut);
  const callcenterX = (1 - phase3) * 30;

  // Influencers: fades in after call center is gone, fades out before globe moves
  const influencersOpacity = influencersFadeIn * (1 - influencersFadeOut);
  const influencersX = (1 - influencersFadeIn) * 30;

  // Digital Workers: fades in with phase4, fades out later
  const digitalWorkersOpacity = dwFadeIn * (1 - dwFadeOut);
  const digitalWorkersX = (1 - dwFadeIn) * -30;

  // Robótica: fades in after DW is gone
  const roboticaOpacity = roboticaFadeIn;
  const roboticaX = (1 - roboticaFadeIn) * -30;

  return (
    <div style={{ height: "1400vh" }}>
      <div className="h-screen flex items-center justify-center sticky top-0 overflow-hidden">

        {/* Globe */}
        <div
          className="absolute z-10 transition-none"
          style={{
            width: "500px",
            height: "500px",
            opacity: sphereOpacity,
            transform: `translateX(${globeX}vw) scale(${globeScale})`,
          }}
        >
          <RotatingEarth width={500} height={500} />
        </div>

        {/* EXO Logo — fades out in phase 1 */}
        <div className="absolute z-20 text-center pointer-events-none">
          <h1
            className="text-[clamp(4rem,14vw,12rem)] font-bold tracking-[-0.06em] leading-[0.85] text-white select-none"
            style={{
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
            }}
          >
            EXO
          </h1>
          <p
            className="mt-4 text-base font-light text-white/40 max-w-sm mx-auto"
            style={{ opacity: subtitleOpacity }}
          >
            Expanding humans through digital twins, AI agents and robotics.
          </p>
        </div>

        {/* Pillar cards — horizontal row below globe */}
        <div
          className="absolute z-20 bottom-[8%] left-0 right-0 flex justify-center px-6"
          style={{
            opacity: Math.min(phase1 * 2.5, 1) * (1 - phase3),
            transform: `translateY(${(1 - Math.min(phase1 * 2, 1)) * 40}px)`,
            pointerEvents: phase1 > 0.3 && phase3 < 0.5 ? "auto" : "none",
          }}
        >
          <div className="flex gap-3 max-w-4xl w-full">
            {[
              { icon: Bot, label: "Call Center", desc: "Agentes de voz com IA que atendem 24/7", href: "/callcenter", color: "text-[#5B9BF3]", bg: "bg-[#5B9BF3]/10", border: "border-[#5B9BF3]/20 hover:border-[#5B9BF3]/40" },
              { icon: Brain, label: "Influencers Virtuais", desc: "Influenciadores digitais para redes sociais", href: "/inteligencia-virtual", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20 hover:border-cyan-400/40" },
              { icon: Users, label: "Digital Workers", desc: "Trabalhadores digitais autônomos", href: "/digital-workers", color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20 hover:border-violet-400/40" },
              { icon: Cog, label: "Robótica", desc: "Automação física inteligente", href: "/robotica", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20 hover:border-emerald-400/40", soon: true },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className="group flex-1">
                  <div className={`relative p-4 rounded-2xl border ${item.border} bg-white/[0.03] backdrop-blur-xl transition-all duration-500 group-hover:bg-white/[0.06] group-hover:scale-[1.02] overflow-hidden`}
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                        <Icon size={18} className={item.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-semibold">{item.label}</span>
                          {item.soon && (
                            <span className="text-[8px] font-mono uppercase tracking-wider text-white/30 bg-white/[0.06] px-1.5 py-0.5 rounded-full border border-white/[0.08]">
                              Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-[12px] text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Phase 3: Call Center content — right side */}
        <div
          className="absolute z-30 left-[52%] right-0 pr-[3%] max-w-xl"
          style={{
            opacity: callcenterOpacity,
            transform: `translateX(${callcenterX}px)`,
            pointerEvents: callcenterOpacity > 0.5 ? "auto" : "none",
          }}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#5B9BF3] font-medium mb-4">
            Call Center IA
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Atendimento que
            <br />
            <span className="text-[#5B9BF3]">nunca dorme.</span>
          </h2>
          <p className="text-[#999] text-lg leading-relaxed mb-10">
            Agentes de IA que atendem ligações, resolvem problemas, agendam consultas e cobram
            inadimplentes — tudo com voz natural em português, 24 horas por dia.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {callcenterFeatures.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-[15px] text-[#ccc]">
                <div className="w-10 h-10 rounded-xl bg-[#5B9BF3]/10 flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-[#5B9BF3]" />
                </div>
                {f.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/callcenter"
              className="flex items-center gap-2 px-8 py-3.5 bg-[#5B9BF3] hover:bg-[#5B9BF3]/80 text-white text-base font-medium rounded-xl transition-colors"
            >
              Conhecer o Call Center
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/demo"
              className="text-base text-[#888] hover:text-white transition-colors"
            >
              Agendar demo
            </Link>
          </div>
        </div>

        {/* Phase 3b: Influencers Virtuais — right side (same as callcenter) */}
        <div
          className="absolute z-30 left-[52%] right-0 pr-[3%] max-w-xl"
          style={{
            opacity: influencersOpacity,
            transform: `translateX(${influencersX}px)`,
            pointerEvents: influencersOpacity > 0.5 ? "auto" : "none",
          }}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-cyan-400 font-medium mb-4">
            Influencers Virtuais
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Influência
            <br />
            <span className="text-cyan-400">que nunca para.</span>
          </h2>
          <p className="text-[#999] text-lg leading-relaxed mb-10">
            Crie influencers virtuais com personalidade própria que produzem conteúdo,
            engajam seguidores e representam sua marca 24 horas por dia em todas as plataformas.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {[
              { icon: Brain, text: "Personalidade única" },
              { icon: Users, text: "Engajamento 24/7" },
              { icon: Bot, text: "Conteúdo automático" },
              { icon: Cog, text: "Escala sem limites" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-[15px] text-[#ccc]">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-cyan-400" />
                </div>
                {f.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/inteligencia-virtual"
              className="flex items-center gap-2 px-8 py-3.5 bg-cyan-500 hover:bg-cyan-600 text-white text-base font-medium rounded-xl transition-colors"
            >
              Conhecer Influencers
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/demo"
              className="text-base text-[#888] hover:text-white transition-colors"
            >
              Agendar demo
            </Link>
          </div>
        </div>

        {/* Phase 4: Digital Workers — left side */}
        <div
          className="absolute z-30 left-[8%] right-[52%] max-w-xl"
          style={{
            opacity: digitalWorkersOpacity,
            transform: `translateX(${digitalWorkersX}px)`,
            pointerEvents: digitalWorkersOpacity > 0.5 ? "auto" : "none",
          }}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-violet-400 font-medium mb-4">
            Digital Workers
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Funcionários
            <br />
            <span className="text-violet-400">que não param.</span>
          </h2>
          <p className="text-[#999] text-lg leading-relaxed mb-10">
            Trabalhadores digitais autônomos que executam processos complexos — análise de dados,
            automação de fluxos e tomada de decisão, sem supervisão humana.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {[
              { icon: Bot, text: "Automação de processos" },
              { icon: Brain, text: "Análise de dados" },
              { icon: Users, text: "Trabalho em equipe" },
              { icon: Cog, text: "Integração com sistemas" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-[15px] text-[#ccc]">
                <div className="w-10 h-10 rounded-xl bg-violet-400/10 flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-violet-400" />
                </div>
                {f.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/digital-workers"
              className="flex items-center gap-2 px-8 py-3.5 bg-violet-500 hover:bg-violet-600 text-white text-base font-medium rounded-xl transition-colors"
            >
              Conhecer Digital Workers
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/demo"
              className="text-base text-[#888] hover:text-white transition-colors"
            >
              Agendar demo
            </Link>
          </div>
        </div>

        {/* Phase 4b: Robótica — left side */}
        <div
          className="absolute z-30 left-[8%] right-[52%] max-w-xl"
          style={{
            opacity: roboticaOpacity,
            transform: `translateX(${roboticaX}px)`,
            pointerEvents: roboticaOpacity > 0.5 ? "auto" : "none",
          }}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-emerald-400 font-medium mb-4">
            Robótica
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Automação
            <br />
            <span className="text-emerald-400">física inteligente.</span>
          </h2>
          <p className="text-[#999] text-lg leading-relaxed mb-10">
            Robôs inteligentes para logística, manufatura e operações — controlados por IA,
            integrados ao seu sistema, trabalhando lado a lado com humanos.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {[
              { icon: Cog, text: "Logística automatizada" },
              { icon: Bot, text: "Manufatura inteligente" },
              { icon: Brain, text: "IA embarcada" },
              { icon: Users, text: "Colaboração humano-robô" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-[15px] text-[#ccc]">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-emerald-400" />
                </div>
                {f.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/robotica"
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-medium rounded-xl transition-colors"
            >
              Explorar Robótica
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/demo"
              className="text-base text-[#888] hover:text-white transition-colors"
            >
              Agendar demo
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

