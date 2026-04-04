"use client";

import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

function Sparkline({ data, color = "#5B9BF3" }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="opacity-40">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  delay?: number;
  sparklineData?: number[];
}

export default function KPICard({ title, value, icon: Icon, trend, trendValue, delay = 0, sparklineData }: KPICardProps) {
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-white/30";
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#5B9BF3]/10 flex items-center justify-center">
          <Icon size={20} className="text-[#5B9BF3]" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-mono ${trendColor}`}>
          <TrendIcon size={14} />
          <span>{trendValue}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          <p className="text-xs text-white/40 font-mono uppercase tracking-wider">{title}</p>
        </div>
        {sparklineData && <Sparkline data={sparklineData} />}
      </div>
    </motion.div>
  );
}
