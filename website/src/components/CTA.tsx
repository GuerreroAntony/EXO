"use client";

import { ArrowRight } from "lucide-react";
import { ScrollReveal, Parallax } from "@/components/ScrollReveal";
import { GlowCard } from "@/components/ui/spotlight-card";

export default function CTA() {
  return (
    <section id="contact" className="relative py-40 overflow-hidden">
      <Parallax speed={0.1}>
        <ScrollReveal className="relative z-10 max-w-3xl mx-auto px-6" offset={50}>
          <GlowCard className="text-center">
            <div className="p-12 sm:p-16">
              <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30">
                Próximo passo
              </p>

              <h2 className="mt-6 text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.1] text-white">
                O futuro não espera.
              </h2>
              <p className="mt-2 text-xl text-white/25 font-light">
                Você também não deveria.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/demo"
                  className="group flex items-center gap-3 px-8 py-3.5 text-[13px] font-medium tracking-wide text-white/70 rounded-full transition-all duration-500 hover:text-white"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  Agendar Demo Gratuita
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                </a>

                <a
                  href="#"
                  className="px-8 py-3.5 text-[13px] text-white/30 hover:text-white/60 transition-colors font-medium"
                >
                  Falar com Vendas
                </a>
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>
      </Parallax>
    </section>
  );
}
