"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = void 0;
const response_util_1 = require("../utils/response.util");
const vyra_ai_service_1 = require("../services/vyra-ai.service");
const caption_generator_1 = require("../ai/caption.generator");
const vyra_2125_engine_1 = require("../ai/vyra-2125.engine");
const wrap = (fn) => async (req, res) => {
    try {
        const text = await fn(req.user.userId, req.body);
        return (0, response_util_1.success)(res, { result: text });
    }
    catch (e) {
        return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'AI error', 500);
    }
};
exports.aiController = {
    async caption(req, res) {
        const text = await (0, caption_generator_1.generateCaption)(req.user.userId, String(req.body.context ?? ''));
        return (0, response_util_1.success)(res, { caption: text });
    },
    async twin(req, res) {
        try {
            const result = await (0, vyra_2125_engine_1.invoke2125)(req.user.userId, 'digital_twin', {
                text: String(req.body.message ?? ''),
                mood: req.body.mood ? String(req.body.mood) : undefined,
            });
            return (0, response_util_1.success)(res, { reply: result.output, ...result });
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Twin error', 500);
        }
    },
    improvePost: wrap((uid, b) => vyra_ai_service_1.vyraAiService.improvePost(uid, String(b.content ?? ''))),
    commentSuggestions: wrap((uid, b) => vyra_ai_service_1.vyraAiService.commentSuggestions(uid, String(b.post ?? ''))),
    replySuggestions: wrap((uid, b) => vyra_ai_service_1.vyraAiService.replySuggestions(uid, String(b.thread ?? ''))),
    feedPersonalization: wrap((uid, b) => vyra_ai_service_1.vyraAiService.personalizeFeed(uid, String(b.interests ?? ''))),
    communityModeration: wrap((uid, b) => vyra_ai_service_1.vyraAiService.moderateCommunity(uid, String(b.text ?? ''))),
    spamDetection: wrap((uid, b) => vyra_ai_service_1.vyraAiService.detectSpam(uid, String(b.text ?? ''))),
    toxicDetection: wrap((uid, b) => vyra_ai_service_1.vyraAiService.detectToxic(uid, String(b.text ?? ''))),
    trendDetection: wrap((uid, b) => vyra_ai_service_1.vyraAiService.detectTrends(uid, String(b.corpus ?? ''))),
    creatorAssistant: wrap((uid, b) => vyra_ai_service_1.vyraAiService.creatorAssistant(uid, String(b.brief ?? ''))),
    friendRecommendations: wrap((uid, b) => vyra_ai_service_1.vyraAiService.friendRecommendations(uid, String(b.profile ?? ''))),
    communityRecommendations: wrap((uid, b) => vyra_ai_service_1.vyraAiService.communityRecommendations(uid, String(b.interests ?? ''))),
    interestAnalysis: wrap((uid, b) => vyra_ai_service_1.vyraAiService.interestAnalysis(uid, String(b.activity ?? ''))),
    smartSearch: wrap((uid, b) => vyra_ai_service_1.vyraAiService.smartSearch(uid, String(b.query ?? ''))),
    memoryAssistant: wrap((uid, b) => vyra_ai_service_1.vyraAiService.memoryAssistant(uid, String(b.context ?? ''))),
    lifeOrganizer: wrap((uid, b) => vyra_ai_service_1.vyraAiService.lifeOrganizer(uid, String(b.goals ?? ''))),
    digitalIdentity: wrap((uid, b) => vyra_ai_service_1.vyraAiService.digitalIdentity(uid, String(b.bio ?? ''))),
    reputationEngine: wrap((uid, b) => vyra_ai_service_1.vyraAiService.reputationEngine(uid, String(b.actions ?? ''))),
    growthCoach: wrap((uid, b) => vyra_ai_service_1.vyraAiService.growthCoach(uid, String(b.metrics ?? ''))),
    intentEngine: wrap((uid, b) => vyra_ai_service_1.vyraAiService.intentEngine(uid, String(b.signals ?? ''))),
    communityArchitect: wrap((uid, b) => vyra_ai_service_1.vyraAiService.communityArchitect(uid, String(b.topic ?? ''))),
    knowledgeCompanion: wrap((uid, b) => vyra_ai_service_1.vyraAiService.knowledgeCompanion(uid, String(b.question ?? ''))),
    creativityAssistant: wrap((uid, b) => vyra_ai_service_1.vyraAiService.creativityAssistant(uid, String(b.seed ?? ''))),
    voiceAssistant: wrap((uid, b) => vyra_ai_service_1.vyraAiService.voiceAssistant(uid, String(b.transcript ?? ''))),
};
//# sourceMappingURL=ai.controller.js.map