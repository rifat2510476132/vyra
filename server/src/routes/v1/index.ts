import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validator.middleware';
import { authLimiter } from '../../middleware/rateLimiter.middleware';
import { registerSchema, loginSchema, refreshSchema } from '../../validators/auth.validator';
import { authController } from '../../controllers/auth.controller';
import { postController } from '../../controllers/post.controller';
import { userController } from '../../controllers/user.controller';
import { aiController } from '../../controllers/ai.controller';
import { aiHubController } from '../../controllers/ai-hub.controller';
import { voiceNebulaController } from '../../controllers/voice-nebula.controller';
import { feedController } from '../../controllers/feed.controller';
import { friendController } from '../../controllers/friend.controller';
import { messageController } from '../../controllers/message.controller';
import { notificationController } from '../../controllers/notification.controller';
import { communityController } from '../../controllers/community.controller';
import { searchController } from '../../controllers/search.controller';
import { analyticsController } from '../../controllers/analytics.controller';
import { groupController } from '../../controllers/group.controller';
import { storyController } from '../../controllers/story.controller';
import { reelController } from '../../controllers/reel.controller';
import { galaxyController } from '../../controllers/galaxy.controller';
import { dreamBoardController } from '../../controllers/dream-board.controller';
import { socialEnergyController } from '../../controllers/social-energy.controller';
import { memoryController } from '../../controllers/memory.controller';
import { commentController } from '../../controllers/comment.controller';
import { reactionController } from '../../controllers/reaction.controller';
import { mediaController } from '../../controllers/media.controller';
import { deviceController } from '../../controllers/device.controller';
import { worldController } from '../../controllers/world.controller';
import { realityBoardController } from '../../controllers/reality-board.controller';
import { communityThreadController } from '../../controllers/community-thread.controller';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true, service: 'vyra-api' }));

router.post('/auth/register', authLimiter, validateBody(registerSchema), authController.register);
router.post('/auth/login', authLimiter, validateBody(loginSchema), authController.login);
router.post('/auth/refresh', validateBody(refreshSchema), authController.refresh);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.post('/auth/verify-email', authController.verifyEmail);
router.post('/auth/verify-phone', authController.verifyPhone);
router.post('/auth/google', authController.googleLogin);

router.use(authMiddleware);

router.get('/auth/me', authController.me);
router.get('/users/:username', userController.getProfile);
router.patch('/users/profile', userController.updateProfile);
router.patch('/users/mood', userController.setMood);
router.patch('/users/presence', userController.setPresence);

router.get('/feed', postController.feed);
router.get('/feed/home', feedController.home);
router.get('/feed/following', feedController.following);
router.get('/feed/trending', feedController.trending);
router.get('/feed/explore', feedController.explore);
router.post('/posts', postController.create);
router.get('/posts/:postId/comments', commentController.list);
router.post('/posts/:postId/comments', commentController.create);
router.post('/posts/:postId/react', reactionController.react);
router.post('/posts/:postId/vibe', reactionController.emitVibe);
router.post('/posts/:postId/save', reactionController.save);

router.get('/ai/voice-nebula/status', voiceNebulaController.status);
router.post('/ai/voice-nebula', voiceNebulaController.converse);

router.get('/ai/hub', aiHubController.manifest);
router.post('/ai/invoke', aiHubController.invoke);
router.post('/ai/bundle', aiHubController.bundle);

router.post('/ai/caption', aiController.caption);
router.post('/ai/twin', aiController.twin);
router.post('/ai/improve-post', aiController.improvePost);
router.post('/ai/comment-suggestions', aiController.commentSuggestions);
router.post('/ai/reply-suggestions', aiController.replySuggestions);
router.post('/ai/feed-personalization', aiController.feedPersonalization);
router.post('/ai/community-moderation', aiController.communityModeration);
router.post('/ai/spam-detection', aiController.spamDetection);
router.post('/ai/toxic-detection', aiController.toxicDetection);
router.post('/ai/trend-detection', aiController.trendDetection);
router.post('/ai/creator-assistant', aiController.creatorAssistant);
router.post('/ai/friend-recommendations', aiController.friendRecommendations);
router.post('/ai/community-recommendations', aiController.communityRecommendations);
router.post('/ai/interest-analysis', aiController.interestAnalysis);
router.post('/ai/smart-search', aiController.smartSearch);
router.post('/ai/memory-assistant', aiController.memoryAssistant);
router.post('/ai/life-organizer', aiController.lifeOrganizer);
router.post('/ai/digital-identity', aiController.digitalIdentity);
router.post('/ai/reputation-engine', aiController.reputationEngine);
router.post('/ai/growth-coach', aiController.growthCoach);
router.post('/ai/intent-engine', aiController.intentEngine);
router.post('/ai/community-architect', aiController.communityArchitect);
router.post('/ai/knowledge-companion', aiController.knowledgeCompanion);
router.post('/ai/creativity-assistant', aiController.creativityAssistant);
router.post('/ai/voice-assistant', aiController.voiceAssistant);

router.get('/galaxies', galaxyController.list);
router.get('/galaxies/trending', galaxyController.trending);

router.get('/dream-boards', dreamBoardController.list);
router.post('/dream-boards', dreamBoardController.create);
router.patch('/dream-boards/:id/progress', dreamBoardController.updateProgress);

router.get('/social-energy', socialEnergyController.me);
router.get('/social-energy/leaderboard', socialEnergyController.leaderboard);
router.post('/social-energy/action', socialEnergyController.applyAction);

router.get('/memory-universe', memoryController.universe);
router.post('/memory-capsule', memoryController.capsule);

router.get('/friends', friendController.list);
router.post('/friends/request', friendController.sendRequest);
router.patch('/friends/respond', friendController.respond);

router.get('/conversations', messageController.conversations);
router.post('/conversations/direct', messageController.startDirect);
router.get('/conversations/:conversationId/messages', messageController.messages);
router.patch('/conversations/:conversationId/read', messageController.markRead);

router.get('/media/status', mediaController.status);
router.post('/media/upload', upload.single('file'), mediaController.upload);
router.post('/media/avatar', upload.single('file'), mediaController.uploadAvatar);
router.post('/media/cover', upload.single('file'), mediaController.uploadCover);
router.delete('/media/:mediaId', mediaController.remove);

router.get('/devices/status', deviceController.status);
router.post('/devices/register', deviceController.register);
router.delete('/devices/register', deviceController.unregister);

router.get('/notifications', notificationController.list);
router.patch('/notifications/read-all', notificationController.markAllRead);
router.patch('/notifications/:id/read', notificationController.markRead);

router.get('/worlds', worldController.list);
router.get('/worlds/:slug', worldController.detail);
router.post('/worlds/:id/join', worldController.join);

router.get('/reality-boards', realityBoardController.list);
router.post('/reality-boards', realityBoardController.create);
router.patch('/reality-boards/:id', realityBoardController.update);

router.get('/communities', communityController.list);
router.post('/communities/:id/join', communityController.join);
router.get('/communities/:communityId/threads', communityThreadController.list);
router.post('/communities/:communityId/threads', communityThreadController.create);
router.post('/community-threads/:threadId/vote', communityThreadController.vote);

router.get('/groups', groupController.list);
router.post('/groups', groupController.create);
router.post('/groups/:id/join', groupController.join);

router.get('/stories', storyController.feed);
router.post('/stories', storyController.create);
router.get('/reels', reelController.feed);
router.post('/reels', reelController.create);

router.get('/search', searchController.search);
router.get('/analytics/creator', analyticsController.creator);
router.get('/analytics/trends', analyticsController.trends);

export default router;
