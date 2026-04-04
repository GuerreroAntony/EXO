"use client";

import React, { useEffect, useRef, ReactNode, useCallback } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "rgba(255, 255, 255, 0.15)",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!cardRef.current || !glowRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 250;
    const isNear =
      e.clientX >= rect.left - padding &&
      e.clientX <= rect.right + padding &&
      e.clientY >= rect.top - padding &&
      e.clientY <= rect.bottom + padding;

    if (isNear) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.background = `radial-gradient(500px circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`;
    } else {
      glowRef.current.style.opacity = "0";
    }
  }, [glowColor]);

  useEffect(() => {
    document.addEventListener("pointermove", handlePointerMove);
    return () => document.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-[20px] overflow-hidden ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-700 pointer-events-none z-0"
      />

      {/* Top highlight line (liquid glass effect) */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none z-0"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export { GlowCard };
