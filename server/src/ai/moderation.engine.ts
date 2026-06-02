import { getOpenAI, defaultModel } from './openai.client';

export async function moderateContent(text: string): Promise<{
  safe: boolean;
  reason?: string;
}> {
  const openai = getOpenAI();
  if (!openai) return { safe: true };

  const completion = await openai.chat.completions.create({
    model: defaultModel,
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Return JSON: {"safe":boolean,"reason":string}. Detect spam, harassment, misinformation.',
      },
      { role: 'user', content: text },
    ],
    max_tokens: 100,
  });

  try {
    const raw = completion.choices[0]?.message?.content ?? '{"safe":true}';
    return JSON.parse(raw);
  } catch {
    return { safe: true };
  }
}
