"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vyraAiService = void 0;
const openai_client_1 = require("../ai/openai.client");
const anti_repetition_engine_1 = require("../ai/anti-repetition.engine");
async function vyraComplete(userId, feature, system, userPrompt, maxTokens = 400) {
    const { lastResponses } = await (0, anti_repetition_engine_1.getAiContext)(userId, feature);
    const hint = lastResponses.length
        ? `Avoid repeating: ${lastResponses.slice(-3).join(' | ')}`
        : '';
    let text = await (0, openai_client_1.chatCompletion)([
        { role: 'system', content: `${system}\n${hint}` },
        { role: 'user', content: userPrompt },
    ], { temperature: (0, anti_repetition_engine_1.taskTemperature)(feature), maxTokens });
    if ((0, anti_repetition_engine_1.isTooSimilar)(text, lastResponses)) {
        text = `${text} — refracted anew.`;
    }
    await (0, anti_repetition_engine_1.saveAiResponse)(userId, feature, userPrompt, text);
    return text;
}
exports.vyraAiService = {
    caption: (userId, context) => vyraComplete(userId, 'caption', 'VYRA AI caption generator. Futuristic, unique.', context, 120),
    improvePost: (userId, content) => vyraComplete(userId, 'post_improver', 'Improve this social post for year 2125.', content),
    commentSuggestions: (userId, post) => vyraComplete(userId, 'comment_suggestions', 'Suggest 3 short comments as JSON array.', post),
    replySuggestions: (userId, thread) => vyraComplete(userId, 'reply_suggestions', 'Suggest 3 reply options.', thread),
    personalizeFeed: (userId, interests) => vyraComplete(userId, 'feed_personalization', 'Summarize feed personalization strategy.', interests),
    moderateCommunity: (userId, text) => vyraComplete(userId, 'community_moderation', 'Moderation advice for community post.', text),
    detectSpam: (userId, text) => vyraComplete(userId, 'spam_detection', 'Return SPAM or SAFE with reason.', text, 80),
    detectToxic: (userId, text) => vyraComplete(userId, 'toxic_detection', 'Return TOXIC or SAFE with reason.', text, 80),
    detectTrends: (userId, corpus) => vyraComplete(userId, 'trend_detection', 'List emerging trends.', corpus),
    creatorAssistant: (userId, brief) => vyraComplete(userId, 'creator_assistant', 'Creator studio advice.', brief),
    friendRecommendations: (userId, profile) => vyraComplete(userId, 'friend_recommendations', 'Suggest connection types.', profile),
    communityRecommendations: (userId, interests) => vyraComplete(userId, 'community_recommendations', 'Recommend communities.', interests),
    interestAnalysis: (userId, activity) => vyraComplete(userId, 'interest_analysis', 'Analyze user interests.', activity),
    smartSearch: (userId, query) => vyraComplete(userId, 'smart_search', 'Expand search intent for Vyra.', query),
    digitalTwin: (userId, message) => vyraComplete(userId, 'digital_twin', 'You are the user VYRA Digital Twin.', message),
    memoryAssistant: (userId, context) => vyraComplete(userId, 'memory_assistant', 'Memory timeline assistant.', context),
    lifeOrganizer: (userId, goals) => vyraComplete(userId, 'life_organizer', 'Organize goals and next steps.', goals),
    digitalIdentity: (userId, bio) => vyraComplete(userId, 'digital_identity', 'Refine digital identity.', bio),
    reputationEngine: (userId, actions) => vyraComplete(userId, 'reputation_engine', 'Reputation lattice insight.', actions),
    growthCoach: (userId, metrics) => vyraComplete(userId, 'growth_coach', 'Growth coaching.', metrics),
    intentEngine: (userId, signals) => vyraComplete(userId, 'intent_engine', 'Predict user intent.', signals),
    communityArchitect: (userId, topic) => vyraComplete(userId, 'community_architect', 'Design organic community.', topic),
    knowledgeCompanion: (userId, question) => vyraComplete(userId, 'knowledge_companion', 'Knowledge companion answer.', question),
    creativityAssistant: (userId, seed) => vyraComplete(userId, 'creativity_assistant', 'Creative expansion.', seed),
    voiceAssistant: (userId, transcript) => vyraComplete(userId, 'voice_assistant', 'Respond for voice UI.', transcript),
};
//# sourceMappingURL=vyra-ai.service.js.map