import OpenAI from 'openai';
import { env } from '../config/env';

let client: OpenAI | null = null;

export const defaultModel = process.env.OPENAI_MODEL ?? 'gpt-4o';

export function getOpenAIClient(): OpenAI {
  if (!client) {
    if (!env.openai.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    client = new OpenAI({ apiKey: env.openai.apiKey });
  }
  return client;
}

export async function chatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options?: { model?: string; maxTokens?: number; temperature?: number }
): Promise<string> {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: options?.model ?? 'gpt-4o-mini',
    messages,
    max_tokens: options?.maxTokens ?? 1024,
    temperature: options?.temperature ?? 0.7,
  });
  return response.choices[0]?.message?.content ?? '';
}

/** Nullable client when API key is not configured (dev fallback). */
export function getOpenAI(): OpenAI | null {
  try {
    return getOpenAIClient();
  } catch {
    return null;
  }
}
