"use client";

import dynamic from "next/dynamic";
import { ScrollingHero } from "@/components/ui/scrolling-animation";

const ParticlesBg = dynamic(() => import("@/components/ui/particles-bg"), { ssr: false });

export default function Hero() {
  return (
    <div className="relative bg-black">
      {/* Particles — fixed behind, visible through sticky hero */}
      <div className="fixed inset-0 z-0">
        <ParticlesBg />
      </div>

      {/* Scrolling hero — sticky section that consumes 180vh of scroll */}
      <div className="relative z-10">
        <ScrollingHero />
      </div>
    </div>
  );
}
