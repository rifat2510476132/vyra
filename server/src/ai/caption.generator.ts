import { getOpenAI, defaultModel } from './openai.client';
import {
  getAiContext,
  saveAiResponse,
  isTooSimilar,
  taskTemperature,
} from './anti-repetition.engine';

export async function generateCaption(
  userId: string,
  context: string
): Promise<string | null> {
  const openai = getOpenAI();
  if (!openai) return 'VYRA moment — captured in the quantum stream.';

  const { lastResponses } = await getAiContext(userId, 'caption');
  const completion = await openai.chat.completions.create({
    model: defaultModel,
    temperature: taskTemperature('caption'),
    messages: [
      {
        role: 'system',
        content:
          'You are VYRA AI. Write unique, futuristic social captions. Never repeat phrasing. Avoid clichés.',
      },
      {
        role: 'user',
        content: `Context: ${context}\nAvoid similar to: ${lastResponses.join(' | ')}`,
      },
    ],
    max_tokens: 120,
  });

  let text = completion.choices[0]?.message?.content?.trim() ?? '';
  if (isTooSimilar(text, lastResponses)) {
    text = `${text} ✦`;
  }
  await saveAiResponse(userId, 'caption', context, text);
  return text;
}
