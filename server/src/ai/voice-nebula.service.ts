import { getOpenAIClient } from './openai.client';
import { invoke2125 } from './vyra-2125.engine';
import { env } from '../config/env';

export type VoiceNebulaVoice = 'nova' | 'shimmer' | 'echo' | 'alloy';

export interface VoiceNebulaResponse {
  transcript: string;
  reply: string;
  replyForSpeech: string;
  mood?: string;
  energySignature?: string;
  poweredBy: 'openai' | 'openai_voice' | 'vyra_neural_fallback';
  audioBase64?: string;
  audioMimeType?: string;
}

function toSpeechLines(text: string): string {
  return text
    .replace(/\n+/g, ' … ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function processVoiceNebula(
  userId: string,
  transcript: string,
  options?: { mood?: string; voice?: VoiceNebulaVoice }
): Promise<VoiceNebulaResponse> {
  const clean = transcript.trim();
  if (!clean) {
    return {
      transcript: '',
      reply: 'I am listening across the nebula. Speak when you are ready.',
      replyForSpeech: 'I am listening across the nebula. Speak when you are ready.',
      poweredBy: 'vyra_neural_fallback',
    };
  }

  const result = await invoke2125(userId, 'voice_nebula', {
    text: clean,
    mood: options?.mood,
    context: { channel: 'voice_nebula' },
  });

  const replyForSpeech = toSpeechLines(result.output);

  let audioBase64: string | undefined;
  let poweredBy: VoiceNebulaResponse['poweredBy'] = result.poweredBy;

  if (env.openai.apiKey) {
    try {
      const openai = getOpenAIClient();
      const speech = await openai.audio.speech.create({
        model: 'tts-1',
        voice: options?.voice ?? 'nova',
        input: replyForSpeech.slice(0, 4096),
        response_format: 'mp3',
      });
      const buf = Buffer.from(await speech.arrayBuffer());
      audioBase64 = buf.toString('base64');
      poweredBy = 'openai_voice';
    } catch {
      // Client will use flutter_tts fallback
    }
  }

  return {
    transcript: clean,
    reply: result.output,
    replyForSpeech,
    mood: options?.mood,
    energySignature: result.energySignature,
    poweredBy,
    audioBase64,
    audioMimeType: audioBase64 ? 'audio/mpeg' : undefined,
  };
}
