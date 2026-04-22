"use client";

import { ArrowRight } from "lucide-react";
import { ScrollReveal, Parallax } from "@/components/ScrollReveal";

export default function CTA() {
  return (
    <section id="contact" className="relative py-32 lg:py-40 overflow-hidden">
      <Parallax speed={0.1}>
        <ScrollReveal className="relative z-10 max-w-6xl mx-auto px-6" offset={50}>
          <div className="text-center">
            {/* Liquid glass card around CTA text */}
            <div
              className="inline-block rounded-3xl px-12 py-14 lg:px-20 lg:py-16"
              style={{
                background: "rgba(255, 255, 255, 0.10)",
                backdropFilter: "blur(60px) saturate(1.8)",
                WebkitBackdropFilter: "blur(60px) saturate(1.8)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                boxShadow: "0 16px 56px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              <p className="text-xs text-white/25 tracking-[0.2em] uppercase font-medium">
                Próximo passo
              </p>

              <h2 className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
                O futuro não espera.
              </h2>
              <p className="mt-3 text-lg text-white/35">
                Você também não deveria.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/demo"
                className="group flex items-center gap-3 bg-white text-black font-medium rounded-full px-8 py-4 text-sm transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5"
              >
                Agendar Demo Gratuita
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              <a
                href="#"
                className="border border-white/[0.08] text-white/40 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 hover:text-white hover:border-white/20 hover:-translate-y-0.5"
              >
                Falar com Vendas
              </a>
            </div>
            </div>
          </div>
        </ScrollReveal>
      </Parallax>
    </section>
  );
}
