// Pricing per 1M tokens (USD), Claude Haiku 4.5
// https://www.anthropic.com/pricing
const HAIKU_4_5 = {
  input: 1.0,
  output: 5.0,
  cacheWrite5m: 1.25,
  cacheRead: 0.1,
} as const;

export interface UsageBreakdown {
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
}

export function calculateCostUsd(usage: UsageBreakdown): number {
  const cost =
    (usage.inputTokens * HAIKU_4_5.input) / 1_000_000 +
    (usage.outputTokens * HAIKU_4_5.output) / 1_000_000 +
    (usage.cacheCreationTokens * HAIKU_4_5.cacheWrite5m) / 1_000_000 +
    (usage.cacheReadTokens * HAIKU_4_5.cacheRead) / 1_000_000;
  return Math.round(cost * 1_000_000) / 1_000_000;
}
