import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { success, fail } from '../utils/response.util';
import {
  invoke2125,
  list2125Capabilities,
  Vyra2125Capability,
} from '../ai/vyra-2125.engine';

const CAPABILITY_IDS = new Set(list2125Capabilities().map((c) => c.id));

export const aiHubController = {
  manifest(_req: AuthRequest, res: Response) {
    return success(res, {
      name: 'VYRA Neural Hub',
      era: 2125,
      antiRepetition: true,
      capabilities: list2125Capabilities(),
    });
  },

  async invoke(req: AuthRequest, res: Response) {
    const capability = String(req.body.capability ?? '') as Vyra2125Capability;
    if (!CAPABILITY_IDS.has(capability)) {
      return fail(res, `Unknown capability: ${capability}`, 400);
    }
    const result = await invoke2125(req.user!.userId, capability, {
      text: req.body.text ? String(req.body.text) : undefined,
      mood: req.body.mood ? String(req.body.mood) : undefined,
      context: req.body.context,
    });
    return success(res, result);
  },

  async bundle(req: AuthRequest, res: Response) {
    const text = String(req.body.text ?? '');
    const mood = req.body.mood ? String(req.body.mood) : undefined;
    const userId = req.user!.userId;
    const [digest, moodOracle, intent] = await Promise.all([
      invoke2125(userId, 'twin_digest', { text, mood }),
      invoke2125(userId, 'mood_oracle', { text, mood }),
      invoke2125(userId, 'intent_engine', { text, mood }),
    ]);
    return success(res, { digest, moodOracle, intent });
  },
};
