import 'package:go_router/go_router.dart';
import '../features/splash/splash_screen.dart';
import '../features/onboarding/onboarding_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/register_screen.dart';
import '../features/auth/verify_screen.dart';
import '../features/auth/forgot_password_screen.dart';
import '../features/home/home_shell.dart';
import '../features/create_post/create_post_screen.dart';
import '../features/settings/settings_screen.dart';
import '../features/search/search_screen.dart';
import '../features/dream_board/dream_board_screen.dart';
import '../features/memory_universe/memory_universe_screen.dart';
import '../features/social_energy/social_energy_screen.dart';
import '../features/chat/chat_screen.dart';
import '../features/group_chat/group_chat_screen.dart';
import '../features/communities/communities_screen.dart';
import '../features/notifications/notifications_screen.dart';
import '../features/edit_profile/edit_profile_screen.dart';
import '../features/relationship_map/relationship_map_screen.dart';
import '../features/reels/reels_screen.dart';
import '../features/stories/stories_screen.dart';
import '../features/analytics/analytics_screen.dart';
import '../features/groups/groups_screen.dart';
import '../features/ai_assistant/ai_assistant_screen.dart';
import '../features/ai_hub/ai_hub_screen.dart';
import '../features/voice_nebula/voice_nebula_screen.dart';
import '../features/worlds/vyra_worlds_screen.dart';
import '../features/reality_board/reality_board_screen.dart';
import '../features/communities/community_detail_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (_, __) => const SplashScreen()),
    GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
    GoRoute(path: '/verify', builder: (_, __) => const VerifyScreen()),
    GoRoute(path: '/forgot-password', builder: (_, __) => const ForgotPasswordScreen()),
    GoRoute(path: '/home', builder: (_, __) => const HomeShell()),
    GoRoute(path: '/create-post', builder: (_, __) => const CreatePostScreen()),
    GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
    GoRoute(path: '/search', builder: (_, __) => const SearchScreen()),
    GoRoute(path: '/dream-board', builder: (_, __) => const DreamBoardScreen()),
    GoRoute(path: '/memory-universe', builder: (_, __) => const MemoryUniverseScreen()),
    GoRoute(path: '/social-energy', builder: (_, __) => const SocialEnergyScreen()),
    GoRoute(
      path: '/chat/:id',
      builder: (_, state) => ChatScreen(
        conversationId: state.pathParameters['id']!,
        title: state.uri.queryParameters['title'] ?? 'Signal',
      ),
    ),
    GoRoute(
      path: '/group-chat/:id',
      builder: (_, state) => GroupChatScreen(
        groupId: state.pathParameters['id']!,
        name: state.uri.queryParameters['name'] ?? 'Collective',
      ),
    ),
    GoRoute(path: '/communities', builder: (_, __) => const CommunitiesScreen()),
    GoRoute(
      path: '/community/:id',
      builder: (_, state) => CommunityDetailScreen(
        communityId: state.pathParameters['id']!,
        name: state.uri.queryParameters['name'] ?? 'Collective',
      ),
    ),
    GoRoute(path: '/vyra-worlds', builder: (_, __) => const VyraWorldsScreen()),
    GoRoute(path: '/reality-board', builder: (_, __) => const RealityBoardScreen()),
    GoRoute(path: '/notifications', builder: (_, __) => const NotificationsScreen()),
    GoRoute(path: '/edit-profile', builder: (_, __) => const EditProfileScreen()),
    GoRoute(path: '/relationship-map', builder: (_, __) => const RelationshipMapScreen()),
    GoRoute(path: '/reels', builder: (_, __) => const ReelsScreen()),
    GoRoute(path: '/stories', builder: (_, __) => const StoriesScreen()),
    GoRoute(path: '/analytics', builder: (_, __) => const AnalyticsScreen()),
    GoRoute(path: '/groups', builder: (_, __) => const GroupsScreen()),
    GoRoute(path: '/ai-assistant', builder: (_, __) => const AiAssistantScreen()),
    GoRoute(path: '/ai-hub', builder: (_, __) => const AiHubScreen()),
    GoRoute(path: '/voice-nebula', builder: (_, __) => const VoiceNebulaScreen()),
  ],
);
