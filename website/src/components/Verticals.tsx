"use client";

import dynamic from "next/dynamic";
import { ScrollReveal, Parallax } from "@/components/ScrollReveal";

const SkewCards = dynamic(() => import("@/components/ui/gradient-card-showcase"), { ssr: false });

export default function Verticals() {
  return (
    <section id="verticals" className="relative py-32 bg-black">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header with parallax */}
        <Parallax speed={0.15}>
          <ScrollReveal className="text-center mb-20">
            <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30">
              Verticais
            </p>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[0.95] text-white">
              Quatro pilares.
            </h2>
            <p className="mt-3 text-lg text-white/25 font-light">
              Uma revolução.
            </p>
          </ScrollReveal>
        </Parallax>

        {/* Cards */}
        <ScrollReveal offset={80} scaleFrom={0.95}>
          <SkewCards />
        </ScrollReveal>
      </div>
    </section>
  );
}
