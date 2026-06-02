import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../../core/services/api_service.dart';
import '../../core/services/push_notification_service.dart';
import '../../core/services/storage_service.dart';

final authStateProvider = StateNotifierProvider<AuthNotifier, AsyncValue<bool>>(
  (ref) => AuthNotifier(
    ref.watch(apiServiceProvider),
    ref.watch(pushNotificationServiceProvider),
  ),
);

class AuthNotifier extends StateNotifier<AsyncValue<bool>> {
  AuthNotifier(this._api, this._push) : super(const AsyncValue.loading()) {
    _bootstrap();
  }

  final ApiService _api;
  final PushNotificationService _push;

  Future<void> _bootstrap() async {
    final token = await StorageService.instance.getAccessToken();
    final loggedIn = token != null;
    state = AsyncValue.data(loggedIn);
    if (loggedIn) {
      await _push.registerAfterAuth();
    }
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final res = await _api.post('/auth/login', {
        'email': email,
        'password': password,
      });
      final data = res['data'] as Map<String, dynamic>;
      await StorageService.instance.saveTokens(
        access: data['accessToken'] as String,
        refresh: data['refreshToken'] as String,
      );
      final user = data['user'] as Map<String, dynamic>?;
      if (user != null) {
        await StorageService.instance.writePref('user_id', user['id']);
      }
      state = const AsyncValue.data(true);
      await _push.registerAfterAuth();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String username,
    required String displayName,
  }) async {
    state = const AsyncValue.loading();
    try {
      final res = await _api.post('/auth/register', {
        'email': email,
        'password': password,
        'username': username,
        'displayName': displayName,
      });
      final data = res['data'] as Map<String, dynamic>;
      await StorageService.instance.saveTokens(
        access: data['accessToken'] as String,
        refresh: data['refreshToken'] as String,
      );
      final user = data['user'] as Map<String, dynamic>?;
      if (user != null) {
        await StorageService.instance.writePref('user_id', user['id']);
      }
      state = const AsyncValue.data(true);
      await _push.registerAfterAuth();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> loginWithGoogle() async {
    state = const AsyncValue.loading();
    try {
      final google = GoogleSignIn(scopes: ['email', 'profile']);
      final account = await google.signIn();
      if (account == null) {
        state = const AsyncValue.data(false);
        return;
      }
      final auth = await account.authentication;
      final idToken = auth.idToken;
      if (idToken == null) throw Exception('No Google id token');

      final res = await _api.post('/auth/google', {'idToken': idToken});
      final data = res['data'] as Map<String, dynamic>;
      await StorageService.instance.saveTokens(
        access: data['accessToken'] as String,
        refresh: data['refreshToken'] as String,
      );
      final user = data['user'] as Map<String, dynamic>?;
      if (user != null) {
        await StorageService.instance.writePref('user_id', user['id']);
      }
      state = const AsyncValue.data(true);
      await _push.registerAfterAuth();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> logout() async {
    await _push.unregister();
    await StorageService.instance.clearTokens();
    state = const AsyncValue.data(false);
  }
}
