import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { success, fail } from '../utils/response.util';
import { processVoiceNebula, VoiceNebulaVoice } from '../ai/voice-nebula.service';

export const voiceNebulaController = {
  async converse(req: AuthRequest, res: Response) {
    const transcript = String(req.body.transcript ?? req.body.text ?? '').trim();
    if (!transcript) return fail(res, 'transcript required');

    const voice = (req.body.voice as VoiceNebulaVoice) ?? 'nova';
    const mood = req.body.mood ? String(req.body.mood) : undefined;

    const result = await processVoiceNebula(req.user!.userId, transcript, { mood, voice });
    return success(res, result);
  },

  async status(_req: AuthRequest, res: Response) {
    return success(res, {
      name: 'Voice Nebula',
      stt: 'device', // Flutter speech_to_text
      tts: 'device_or_openai',
      voices: ['nova', 'shimmer', 'echo', 'alloy'],
      era: 2125,
    });
  },
};
