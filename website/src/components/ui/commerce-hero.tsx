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
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start pt-12 pb-24 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tight leading-[1.05] text-foreground">
            Seu próximo{" "}
            <span className="underline decoration-2 underline-offset-[6px] decoration-foreground/30">
              funcionário
            </span>{" "}
            não é{" "}
            <span className="underline decoration-2 underline-offset-[6px] decoration-foreground/30">
              humano
            </span>
          </h1>
        </motion.div>

        <motion.div
          className="lg:pt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <p className="text-lg lg:text-xl text-foreground/70 leading-relaxed max-w-lg">
            A EXO leva inteligência artificial para operações de vendas, atendimento,
            marketing e finanças — em qualquer lugar do mundo.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2 bg-foreground text-background font-medium text-sm px-6 py-3 rounded-full transition-all duration-300 hover:bg-foreground/90"
            >
              Agendar Demo
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="/equipe"
              className="text-sm text-foreground/50 hover:text-foreground transition-colors"
            >
              Conhecer a equipe
            </Link>
          </div>
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
