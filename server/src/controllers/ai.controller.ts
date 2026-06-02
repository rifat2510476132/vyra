import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { success, fail } from '../utils/response.util';
import { vyraAiService } from '../services/vyra-ai.service';
import { generateCaption } from '../ai/caption.generator';
import { invoke2125 } from '../ai/vyra-2125.engine';

const wrap = (fn: (userId: string, body: Record<string, unknown>) => Promise<string>) =>
  async (req: AuthRequest, res: Response) => {
    try {
      const text = await fn(req.user!.userId, req.body as Record<string, unknown>);
      return success(res, { result: text });
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'AI error', 500);
    }
  };

export const aiController = {
  async caption(req: AuthRequest, res: Response) {
    const text = await generateCaption(req.user!.userId, String(req.body.context ?? ''));
    return success(res, { caption: text });
  },

  async twin(req: AuthRequest, res: Response) {
    try {
      const result = await invoke2125(req.user!.userId, 'digital_twin', {
        text: String(req.body.message ?? ''),
        mood: req.body.mood ? String(req.body.mood) : undefined,
      });
      return success(res, { reply: result.output, ...result });
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Twin error', 500);
    }
  },

  improvePost: wrap((uid, b) => vyraAiService.improvePost(uid, String(b.content ?? ''))),
  commentSuggestions: wrap((uid, b) => vyraAiService.commentSuggestions(uid, String(b.post ?? ''))),
  replySuggestions: wrap((uid, b) => vyraAiService.replySuggestions(uid, String(b.thread ?? ''))),
  feedPersonalization: wrap((uid, b) => vyraAiService.personalizeFeed(uid, String(b.interests ?? ''))),
  communityModeration: wrap((uid, b) => vyraAiService.moderateCommunity(uid, String(b.text ?? ''))),
  spamDetection: wrap((uid, b) => vyraAiService.detectSpam(uid, String(b.text ?? ''))),
  toxicDetection: wrap((uid, b) => vyraAiService.detectToxic(uid, String(b.text ?? ''))),
  trendDetection: wrap((uid, b) => vyraAiService.detectTrends(uid, String(b.corpus ?? ''))),
  creatorAssistant: wrap((uid, b) => vyraAiService.creatorAssistant(uid, String(b.brief ?? ''))),
  friendRecommendations: wrap((uid, b) => vyraAiService.friendRecommendations(uid, String(b.profile ?? ''))),
  communityRecommendations: wrap((uid, b) =>
    vyraAiService.communityRecommendations(uid, String(b.interests ?? ''))
  ),
  interestAnalysis: wrap((uid, b) => vyraAiService.interestAnalysis(uid, String(b.activity ?? ''))),
  smartSearch: wrap((uid, b) => vyraAiService.smartSearch(uid, String(b.query ?? ''))),
  memoryAssistant: wrap((uid, b) => vyraAiService.memoryAssistant(uid, String(b.context ?? ''))),
  lifeOrganizer: wrap((uid, b) => vyraAiService.lifeOrganizer(uid, String(b.goals ?? ''))),
  digitalIdentity: wrap((uid, b) => vyraAiService.digitalIdentity(uid, String(b.bio ?? ''))),
  reputationEngine: wrap((uid, b) => vyraAiService.reputationEngine(uid, String(b.actions ?? ''))),
  growthCoach: wrap((uid, b) => vyraAiService.growthCoach(uid, String(b.metrics ?? ''))),
  intentEngine: wrap((uid, b) => vyraAiService.intentEngine(uid, String(b.signals ?? ''))),
  communityArchitect: wrap((uid, b) => vyraAiService.communityArchitect(uid, String(b.topic ?? ''))),
  knowledgeCompanion: wrap((uid, b) => vyraAiService.knowledgeCompanion(uid, String(b.question ?? ''))),
  creativityAssistant: wrap((uid, b) => vyraAiService.creativityAssistant(uid, String(b.seed ?? ''))),
  voiceAssistant: wrap((uid, b) => vyraAiService.voiceAssistant(uid, String(b.transcript ?? ''))),
};
