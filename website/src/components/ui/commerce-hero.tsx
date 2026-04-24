"use client";

import { ArrowUpRight, Users, Sparkles, Lightbulb, Cog } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    title: "Digital Workers",
    desc: "Funcionários digitais autônomos que executam, decidem e aprendem.",
    icon: Users,
    color: "#6366f1",
    href: "/digital-workers",
    cta: "Conhecer",
  },
  {
    title: "Influencers Virtuais",
    desc: "Personalidades digitais que engajam e criam conteúdo 24/7.",
    icon: Sparkles,
    color: "#0ea5e9",
    href: "/inteligencia-virtual",
    cta: "Conhecer",
  },
  {
    title: "Innovation Studio",
    desc: "Soluções personalizadas de IA sob medida para seu negócio.",
    icon: Lightbulb,
    color: "#f97316",
    href: "/innovation-studio",
    cta: "Explorar",
  },
  {
    title: "Robótica",
    desc: "Automação física inteligente para logística e manufatura.",
    icon: Cog,
    color: "#10b981",
    href: "/robotica",
    cta: "Em breve",
    soon: true,
  },
];

export function CommerceHero() {
  return (
    <div className="w-full relative max-w-7xl mx-auto px-6 pt-32 pb-16">

      {/* Hero — Anthropic style: title left, description right */}
      {/* Hero — Anthropic layout */}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-20 items-end pt-16 lg:pt-24 pb-20 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-[clamp(2.5rem,5vw,4.2rem)] font-extrabold tracking-[-0.03em] leading-[1.1] text-foreground">
            IA{" "}
            <span className="underline decoration-[3px] underline-offset-[8px] decoration-foreground/30">
              aplicada
            </span>{" "}
            e{" "}
            <span className="underline decoration-[3px] underline-offset-[8px] decoration-foreground/30">
              agentes
            </span>{" "}
            que expandem operações humanas
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className=""
        >
          <p className="text-[clamp(0.95rem,1.3vw,1.15rem)] text-foreground leading-[1.6] tracking-[-0.01em]">
            A EXO leva inteligência artificial para operações de vendas, atendimento,
            marketing e finanças — em qualquer lugar do mundo.
          </p>
        </motion.div>
      </div>

      {/* Pillar cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              className="group relative bg-muted/50 rounded-3xl p-6 sm:p-8 w-full overflow-hidden transition-all duration-500 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: "easeOut" }}
              style={{ borderTop: `3px solid ${category.color}` }}
            >
              <Link href={category.href} className="block">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${category.color}12` }}
                >
                  <Icon size={28} style={{ color: category.color }} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-bold mb-2 transition-colors duration-300"
                  style={{ color: category.color }}
                >
                  {category.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {category.desc}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all duration-300"
                  style={{ color: category.color }}
                >
                  {category.cta}
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
