import Anthropic from "@anthropic-ai/sdk";
import { calculateCostUsd } from "./cost";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 500;

let cached: Anthropic | null = null;

function getClient(): Anthropic {
  if (cached) return cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing env var: ANTHROPIC_API_KEY");
  cached = new Anthropic({ apiKey });
  return cached;
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

export interface GenerateReplyResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  costUsd: number;
}

export async function generateReply(
  systemPrompt: string,
  history: ChatTurn[],
): Promise<GenerateReplyResult> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: history,
  });

  const firstBlock = response.content[0];
  const text = firstBlock?.type === "text" ? firstBlock.text.trim() : "";

  const usage = {
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
    cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
  };

  return {
    text,
    ...usage,
    costUsd: calculateCostUsd(usage),
  };
}
