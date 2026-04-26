"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export default function RoboticaPage() {
  return (
    <main className="min-h-screen">
      <section className="relative pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
            className="text-[13px] tracking-[0.3em] uppercase text-emerald-400 font-medium text-center"
          >
            Robótica
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10"
          >
            <Card className="w-full h-[600px] bg-black/[0.96] relative overflow-hidden border-neutral-800 rounded-3xl">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="rgb(52,211,153)"
              />

              <div className="flex flex-col md:flex-row h-full">
                <div className="flex-1 p-8 sm:p-12 relative z-10 flex flex-col justify-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-[1.05]">
                    O corpo da
                    <br />
                    evolução.
                  </h1>
                  <p className="mt-6 text-neutral-300 max-w-md leading-relaxed">
                    Automação física inteligente para logística, manufatura e
                    operações. Robôs que pensam, se movem e aprendem — em
                    tempo real, em qualquer ambiente.
                  </p>
                  <div className="mt-10">
                    <Link
                      href="/demo"
                      className="group inline-flex items-center gap-3 bg-emerald-400 text-black rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-emerald-300 hover:-translate-y-0.5"
                    >
                      Falar com o comercial
                      <ArrowRight
                        size={15}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>

                <div className="flex-1 relative min-h-[280px] md:min-h-0">
                  <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
