"use client";

import { ArrowUpRight, Users, Sparkles, Lightbulb, Cog } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    title: "Digital Workers",
    desc: "Funcionários digitais autônomos que executam, decidem e aprendem.",
    icon: Users,
    color: "#a78bfa",
    href: "/digital-workers",
    cta: "Conhecer",
  },
  {
    title: "Influencers Virtuais",
    desc: "Personalidades digitais que engajam e criam conteúdo 24/7.",
    icon: Sparkles,
    color: "#22d3ee",
    href: "/inteligencia-virtual",
    cta: "Conhecer",
  },
  {
    title: "Innovation Studio",
    desc: "Soluções personalizadas de IA sob medida para seu negócio.",
    icon: Lightbulb,
    color: "#f59e0b",
    href: "/innovation-studio",
    cta: "Explorar",
  },
  {
    title: "Robótica",
    desc: "Automação física inteligente para logística e manufatura.",
    icon: Cog,
    color: "#34d399",
    href: "/robotica",
    cta: "Em breve",
    soon: true,
  },
];

export function CommerceHero() {
  return (
    <div className="w-full relative container px-2 mx-auto max-w-7xl pt-24">

        <div className="bg-accent/50 rounded-2xl relative">
          <motion.section
            className="w-full px-4 py-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mx-auto text-center">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <span className="text-foreground">
                  EXO
                </span>
              </motion.h1>
              <motion.p
                className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                Levamos inteligência artificial para operações de vendas, atendimento,
                marketing e finanças em qualquer lugar do mundo.
              </motion.p>
            </div>
          </motion.section>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mt-12 mb-20">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                className="group relative bg-muted/50 rounded-3xl p-6 sm:p-8 w-full overflow-hidden transition-all duration-500 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
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
