import { getOpenAI, defaultModel } from './openai.client';
import {
  getAiContext,
  saveAiResponse,
  taskTemperature,
} from './anti-repetition.engine';

export async function twinRespond(
  userId: string,
  userMessage: string,
  personalityHint?: string
): Promise<string> {
  const openai = getOpenAI();
  if (!openai) {
    return 'Your VYRA Twin is calibrating. I sense curiosity in your signal — tell me more.';
  }

  const { lastResponses, contextJson } = await getAiContext(userId, 'digital_twin');
  const completion = await openai.chat.completions.create({
    model: defaultModel,
    temperature: taskTemperature('twin'),
    messages: [
      {
        role: 'system',
        content: `You are the user's VYRA Digital Twin in year 2125. Personality: ${personalityHint ?? 'warm, insightful'}. Memory: ${JSON.stringify(contextJson)}. Vary wording every reply.`,
      },
      { role: 'user', content: userMessage },
      ...lastResponses.slice(0, 3).map((r) => ({ role: 'assistant' as const, content: r })),
    ],
    max_tokens: 300,
  });

  const text =
    completion.choices[0]?.message?.content?.trim() ??
    'Signal received. Your twin is weaving a response across the nebula.';
  await saveAiResponse(userId, 'digital_twin', userMessage, text);
  return text;
}
