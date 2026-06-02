import { prisma } from '../lib/prisma';

export class AntiRepetitionEngine {
  private readonly history = new Map<string, string[]>();
  private readonly maxHistory = 10;

  record(userId: string, response: string): void {
    const entries = this.history.get(userId) ?? [];
    entries.push(this.normalize(response));
    if (entries.length > this.maxHistory) entries.shift();
    this.history.set(userId, entries);
  }

  isTooSimilar(userId: string, candidate: string): boolean {
    const normalized = this.normalize(candidate);
    const entries = this.history.get(userId) ?? [];
    return entries.some((prev) => this.similarity(prev, normalized) > 0.85);
  }

  private normalize(text: string): string {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private similarity(a: string, b: string): number {
    if (a === b) return 1;
    const setA = new Set(a.split(' '));
    const setB = new Set(b.split(' '));
    const intersection = [...setA].filter((w) => setB.has(w)).length;
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : intersection / union;
  }
}

export const antiRepetitionEngine = new AntiRepetitionEngine();

const memoryCache = new Map<string, string[]>();

function memoryKey(userId: string, feature: string) {
  return `${userId}:${feature}`;
}

export async function getAiContext(userId: string, feature: string) {
  const cached = memoryCache.get(memoryKey(userId, feature)) ?? [];
  try {
    const row = await prisma.aiMemory.findUnique({
      where: { userId_feature: { userId, feature } },
    });
    if (row?.last10Responses) {
      const parsed = row.last10Responses as string[];
      return { lastResponses: parsed, contextJson: (row.contextJson as Record<string, unknown>) ?? {} };
    }
  } catch {
    // ignore
  }
  return { lastResponses: cached, contextJson: {} as Record<string, unknown> };
}

export async function saveAiResponse(
  userId: string,
  feature: string,
  prompt: string,
  response: string
): Promise<void> {
  const key = memoryKey(userId, feature);
  const list = memoryCache.get(key) ?? [];
  list.push(response);
  if (list.length > 10) list.shift();
  memoryCache.set(key, list);
  antiRepetitionEngine.record(userId, response);

  try {
    await prisma.aiMemory.upsert({
      where: { userId_feature: { userId, feature } },
      create: {
        userId,
        feature,
        contextJson: { lastPrompt: prompt },
        last10Responses: list,
      },
      update: {
        contextJson: { lastPrompt: prompt },
        last10Responses: list,
      },
    });
    await prisma.aiLog.create({
      data: {
        userId,
        prompt: `[${feature}] ${prompt}`,
        response,
        model: 'gpt-4o',
        metadata: { feature },
      },
    });
  } catch {
    // DB optional in dev
  }
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(a.toLowerCase().split(/\s+/));
  const setB = new Set(b.toLowerCase().split(/\s+/));
  const intersection = [...setA].filter((w) => setB.has(w)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

export function isTooSimilar(candidate: string, prior: string[]): boolean {
  return prior.some((p) => jaccardSimilarity(candidate, p) > 0.85);
}

export function taskTemperature(task: string): number {
  const temps: Record<string, number> = {
    caption: 0.95,
    twin: 0.88,
    digital_twin: 0.88,
    moderation: 0.3,
    spam_detection: 0.2,
    toxic_detection: 0.2,
    feed: 0.75,
  };
  return temps[task] ?? 0.8 + Math.random() * 0.3;
}
