"use client";

import React, { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-background border border-border shadow-sm ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export { GlowCard };
