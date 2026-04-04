"use client";

import { motion } from "framer-motion";

const lines = [
  { text: "O ser humano não foi feito", highlight: false },
  { text: "para ser substituído.", highlight: false },
  { text: "Foi feito para evoluir.", highlight: true },
  { text: "", highlight: false },
  { text: "Robótica para estender o corpo.", highlight: false },
  { text: "IA para estender a mente.", highlight: false },
  { text: "Digital Workers para", highlight: false },
  { text: "estender o tempo.", highlight: true },
];

export default function Manifesto() {
  return (
    <section className="relative py-48 bg-black overflow-hidden">
      <div className="shader-blob-sm absolute w-[400px] h-[400px] top-1/2 right-0 -translate-y-1/2 opacity-5" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="space-y-2">
          {lines.map((line, i) => {
            if (line.text === "") return <div key={i} className="h-8" />;

            return (
              <motion.p
                key={i}
                initial={{ opacity: 0.05, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: line.highlight ? 1 : 0.5, y: 0, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
                className={`text-3xl sm:text-4xl lg:text-[3.5rem] font-bold tracking-[-0.02em] leading-[1.15] ${
                  line.highlight
                    ? "bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
                    : "text-white"
                }`}
              >
                {line.text}
              </motion.p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
