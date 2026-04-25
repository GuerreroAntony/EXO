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
    <section className="relative py-40 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
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
                className={`text-3xl lg:text-4xl font-medium leading-relaxed tracking-tight ${
                  line.highlight
                    ? "text-foreground"
                    : "text-muted-foreground/50"
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
