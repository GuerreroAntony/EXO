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
  { label: "Preços", href: "/precos" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [showLogo, setShowLogo] = useState(!isHome);

  useEffect(() => {
    // On subpages, always show logo; on homepage, show after scrolling past hero
    if (!isHome) {
      setShowLogo(true);
      const fn = () => {
        setScrolled(window.scrollY > window.innerHeight * 0.8);
      };
      window.addEventListener("scroll", fn);
      return () => window.removeEventListener("scroll", fn);
    }

    const fn = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
      setShowLogo(window.scrollY > window.innerHeight * 0.5);
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
        className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between rounded-2xl transition-all duration-700"
        style={{
          background: "rgba(255, 255, 255, 0.10)",
          backdropFilter: "blur(60px) saturate(1.8)",
          WebkitBackdropFilter: "blur(60px) saturate(1.8)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        }}
      >
        <Link
          href="/"
          className={`text-2xl font-black tracking-[-0.05em] text-white transition-all duration-700 ${
            showLogo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          EXO
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-white/60 hover:text-[#5B9BF3] transition-colors duration-300 tracking-wide uppercase"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard/hub"
            className="px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide text-white/60 hover:text-white transition-all duration-300"
          >
            Entrar
          </Link>
          <Link
            href="/demo"
            className="px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wide text-white/60 border border-white/12 hover:border-white/25 hover:text-white transition-all duration-500"
          >
            Agendar Demo
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white/60">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-6 py-8 flex flex-col gap-5">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-white/40 hover:text-white">
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
