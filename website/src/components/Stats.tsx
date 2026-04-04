"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "99.9%", label: "Uptime garantido" },
  { value: "<1s", label: "Latência média" },
  { value: "70%", label: "Redução de custos" },
  { value: "24/7", label: "Operação contínua" },
];

function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.5"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, y }}
      className="text-center"
    >
      <div
        className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-[-0.04em] text-white"
        style={{ textShadow: "0 0 80px rgba(59,130,246,0.2)" }}
      >
        {stat.value}
      </div>
      <div className="mt-3 text-[11px] text-white/50 tracking-[0.2em] uppercase font-medium">
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="line-fade mb-24" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
          {stats.map((s, i) => (
            <StatItem key={s.label} stat={s} index={i} />
          ))}
        </div>

        <div className="line-fade mt-24" />
      </div>
    </section>
  );
}
