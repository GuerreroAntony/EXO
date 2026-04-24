"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Call Center", href: "/callcenter" },
  { label: "Influencers Virtuais", href: "/inteligencia-virtual" },
  { label: "Digital Workers", href: "/digital-workers" },
  { label: "Robótica", href: "/robotica" },
  { label: "Innovation Studio", href: "/innovation-studio" },
  { label: "Equipe", href: "/equipe" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    if (!isHome) {
      const fn = () => {
        setScrolled(window.scrollY > window.innerHeight * 0.8);
      };
      window.addEventListener("scroll", fn);
      return () => window.removeEventListener("scroll", fn);
    }

    const fn = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [isHome]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 p-4"
    >
      <div
        className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between rounded-2xl transition-all duration-700"
        style={{
          background: "rgba(250, 250, 250, 0.95)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          border: "1px solid rgba(0, 0, 0, 0.10)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Link
          href="/"
          className={`text-2xl font-black tracking-[-0.05em] text-foreground transition-all duration-700 ${
            showLogo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          EXO
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-semibold text-foreground/60 hover:text-foreground transition-colors duration-300 tracking-[0.08em] uppercase whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full text-[11px] font-semibold tracking-[0.05em] text-foreground/60 hover:text-foreground transition-all duration-300"
          >
            Entrar
          </Link>
          <Link
            href="/demo"
            className="px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.05em] text-foreground/80 border border-foreground/15 hover:border-foreground/30 hover:text-foreground transition-all duration-500"
          >
            Agendar Demo
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-muted-foreground">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-6 py-8 flex flex-col gap-5">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
