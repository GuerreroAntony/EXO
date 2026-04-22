"use client";

import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  delay?: number;
  sparklineData?: number[];
  color?: string;
}

export default function KPICard({ title, value, icon: Icon, trend, trendValue, delay = 0, color = "#5B9BF3" }: KPICardProps) {
  const trendColor = trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-[#555]";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#151515] rounded-xl border border-[#333] p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-medium ${trendColor}`}>
          <TrendIcon size={12} />
          <span>{trendValue}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-[11px] text-[#999] uppercase tracking-wider font-medium mt-1">{title}</p>
    </motion.div>
  );
}
