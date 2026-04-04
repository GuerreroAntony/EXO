"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Bot, Brain, Users, Cog, ArrowUpRight } from "lucide-react";

const Sphere3D = dynamic(
  () => import("@/components/ui/sphere-3d").then((m) => ({ default: m.Sphere3D })),
  { ssr: false }
);

const row1 = [
  { icon: Bot, label: "Call Center", href: "/callcenter", desc: "Agentes de voz e WhatsApp com IA que atendem, agendam, cobram e escalam." },
  { icon: Brain, label: "Influencers Virtuais", href: "/inteligencia-virtual", desc: "Influenciadores digitais com IA para redes sociais e marketing." },
];

const row2 = [
  { icon: Users, label: "Digital Workers", href: "/digital-workers", desc: "Trabalhadores digitais autônomos que executam processos complexos." },
  { icon: Cog, label: "Robótica", href: "/robotica", desc: "Automação física inteligente para logística e manufatura.", soon: true },
];

export function ScrollingHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Phase 1: 0–500px — logo fades, sphere appears, row1 slides out left+right
  const phase1 = Math.min(scrollY / 500, 1);
  // Phase 2: 500–1000px — row2 slides out left+right below
  const phase2 = scrollY > 500 ? Math.min((scrollY - 500) / 500, 1) : 0;

  const logoOpacity = Math.max(0, 1 - phase1 * 1.5);
  const logoScale = 1 - phase1 * 0.5;
  const subtitleOpacity = Math.max(0, 1 - phase1 * 4);
  const sphereOpacity = Math.min(phase1 * 2, 0.85);
  const sphereScale = 0.3 + phase1 * 0.7;

  // Row 1 cards — slide out horizontally
  const row1Offset = phase1 * 360; // px from center
  const row1Opacity = Math.min(phase1 * 2.5, 1);

  // Row 2 cards — slide out horizontally, slightly lower
  const row2Offset = phase2 * 360;
  const row2Opacity = Math.min(phase2 * 2.5, 1);

  return (
    <div style={{ height: "350vh" }}>
      <div className="h-screen flex items-center justify-center sticky top-0 overflow-hidden">
        <div className="relative flex items-center justify-center">

          {/* 3D Sphere — center */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              width: "420px",
              height: "420px",
              opacity: sphereOpacity,
              transform: `scale(${sphereScale})`,
            }}
          >
            <Sphere3D className="w-full h-full" />
          </div>

          {/* EXO Logo — fades out */}
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

          {/* Row 1 — left + right of sphere */}
          <div
            className="absolute z-20"
            style={{
              transform: `translateX(${-row1Offset}px) translateY(-80px)`,
              opacity: row1Opacity,
              pointerEvents: phase1 > 0.3 ? "auto" : "none",
            }}
          >
            <CardItem v={row1[0]} />
          </div>
          <div
            className="absolute z-20"
            style={{
              transform: `translateX(${row1Offset}px) translateY(-80px)`,
              opacity: row1Opacity,
              pointerEvents: phase1 > 0.3 ? "auto" : "none",
            }}
          >
            <CardItem v={row1[1]} />
          </div>

          {/* Row 2 — left + right, lower */}
          <div
            className="absolute z-20"
            style={{
              transform: `translateX(${-row2Offset}px) translateY(140px)`,
              opacity: row2Opacity,
              pointerEvents: phase2 > 0.3 ? "auto" : "none",
            }}
          >
            <CardItem v={row2[0]} />
          </div>
          <div
            className="absolute z-20"
            style={{
              transform: `translateX(${row2Offset}px) translateY(140px)`,
              opacity: row2Opacity,
              pointerEvents: phase2 > 0.3 ? "auto" : "none",
            }}
          >
            <CardItem v={row2[1]} />
          </div>

        </div>
      </div>
    </div>
  );
}

function CardItem({ v }: { v: { icon: any; label: string; href: string; desc: string; soon?: boolean } }) {
  const Icon = v.icon;
  return (
    <Link href={v.href} className="group block">
      <div
        className="relative flex flex-row items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-[32px] transition-all duration-500 group-hover:bg-white/[0.10] group-hover:border-white/[0.25] group-hover:scale-[1.03] overflow-hidden"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          width: "320px",
          height: "80px",
        }}
      >
        {/* Top highlight — liquid glass */}
        <div
          className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
        />

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: "radial-gradient(300px circle at 50% 30%, rgba(255,255,255,0.08), transparent 70%)" }}
        />

        {/* Icon */}
        <div className="relative z-10 w-11 h-11 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center shrink-0 group-hover:border-white/25 group-hover:bg-white/[0.12] transition-all duration-500">
          <Icon size={20} className="text-white/50 group-hover:text-white/90 transition-colors duration-500" />
        </div>

        {/* Text */}
        <div className="relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/85 font-semibold leading-tight group-hover:text-white transition-colors duration-500">
              {v.label}
            </span>
            {v.soon && (
              <span className="text-[8px] font-mono uppercase tracking-wider text-white/30 bg-white/[0.06] px-1.5 py-0.5 rounded-full border border-white/[0.08]">
                Soon
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/35 leading-snug mt-0.5 group-hover:text-white/55 transition-colors duration-500 truncate">
            {v.desc}
          </p>
        </div>

        {/* CTA button */}
        <div className="relative z-10 shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] text-[11px] font-medium text-white/45 group-hover:bg-white/[0.12] group-hover:border-white/[0.25] group-hover:text-white/85 transition-all duration-500">
          <span>Ver mais</span>
          <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}
