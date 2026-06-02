import { chatCompletion } from '../ai/openai.client';
import {
  getAiContext,
  saveAiResponse,
  isTooSimilar,
  taskTemperature,
} from '../ai/anti-repetition.engine';

async function vyraComplete(
  userId: string,
  feature: string,
  system: string,
  userPrompt: string,
  maxTokens = 400
): Promise<string> {
  const { lastResponses } = await getAiContext(userId, feature);
  const hint = lastResponses.length
    ? `Avoid repeating: ${lastResponses.slice(-3).join(' | ')}`
    : '';
  let text = await chatCompletion(
    [
      { role: 'system', content: `${system}\n${hint}` },
      { role: 'user', content: userPrompt },
    ],
    { temperature: taskTemperature(feature), maxTokens }
  );
  if (isTooSimilar(text, lastResponses)) {
    text = `${text} — refracted anew.`;
  }
  await saveAiResponse(userId, feature, userPrompt, text);
  return text;
}

export const vyraAiService = {
  caption: (userId: string, context: string) =>
    vyraComplete(userId, 'caption', 'VYRA AI caption generator. Futuristic, unique.', context, 120),

  improvePost: (userId: string, content: string) =>
    vyraComplete(userId, 'post_improver', 'Improve this social post for year 2125.', content),

  commentSuggestions: (userId: string, post: string) =>
    vyraComplete(userId, 'comment_suggestions', 'Suggest 3 short comments as JSON array.', post),

  replySuggestions: (userId: string, thread: string) =>
    vyraComplete(userId, 'reply_suggestions', 'Suggest 3 reply options.', thread),

  personalizeFeed: (userId: string, interests: string) =>
    vyraComplete(userId, 'feed_personalization', 'Summarize feed personalization strategy.', interests),

  moderateCommunity: (userId: string, text: string) =>
    vyraComplete(userId, 'community_moderation', 'Moderation advice for community post.', text),

  detectSpam: (userId: string, text: string) =>
    vyraComplete(userId, 'spam_detection', 'Return SPAM or SAFE with reason.', text, 80),

  detectToxic: (userId: string, text: string) =>
    vyraComplete(userId, 'toxic_detection', 'Return TOXIC or SAFE with reason.', text, 80),

  detectTrends: (userId: string, corpus: string) =>
    vyraComplete(userId, 'trend_detection', 'List emerging trends.', corpus),

  creatorAssistant: (userId: string, brief: string) =>
    vyraComplete(userId, 'creator_assistant', 'Creator studio advice.', brief),

  friendRecommendations: (userId: string, profile: string) =>
    vyraComplete(userId, 'friend_recommendations', 'Suggest connection types.', profile),

  communityRecommendations: (userId: string, interests: string) =>
    vyraComplete(userId, 'community_recommendations', 'Recommend communities.', interests),

  interestAnalysis: (userId: string, activity: string) =>
    vyraComplete(userId, 'interest_analysis', 'Analyze user interests.', activity),

  smartSearch: (userId: string, query: string) =>
    vyraComplete(userId, 'smart_search', 'Expand search intent for Vyra.', query),

  digitalTwin: (userId: string, message: string) =>
    vyraComplete(userId, 'digital_twin', 'You are the user VYRA Digital Twin.', message),

  memoryAssistant: (userId: string, context: string) =>
    vyraComplete(userId, 'memory_assistant', 'Memory timeline assistant.', context),

  lifeOrganizer: (userId: string, goals: string) =>
    vyraComplete(userId, 'life_organizer', 'Organize goals and next steps.', goals),

  digitalIdentity: (userId: string, bio: string) =>
    vyraComplete(userId, 'digital_identity', 'Refine digital identity.', bio),

  reputationEngine: (userId: string, actions: string) =>
    vyraComplete(userId, 'reputation_engine', 'Reputation lattice insight.', actions),

  growthCoach: (userId: string, metrics: string) =>
    vyraComplete(userId, 'growth_coach', 'Growth coaching.', metrics),

  intentEngine: (userId: string, signals: string) =>
    vyraComplete(userId, 'intent_engine', 'Predict user intent.', signals),

  communityArchitect: (userId: string, topic: string) =>
    vyraComplete(userId, 'community_architect', 'Design organic community.', topic),

  knowledgeCompanion: (userId: string, question: string) =>
    vyraComplete(userId, 'knowledge_companion', 'Knowledge companion answer.', question),

  creativityAssistant: (userId: string, seed: string) =>
    vyraComplete(userId, 'creativity_assistant', 'Creative expansion.', seed),

  voiceAssistant: (userId: string, transcript: string) =>
    vyraComplete(userId, 'voice_assistant', 'Respond for voice UI.', transcript),
};
