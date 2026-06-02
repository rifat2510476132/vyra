import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../firebase_options.dart';
import 'api_service.dart';
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  if (DefaultFirebaseOptions.isConfigured) {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  }
  debugPrint('FCM background: ${message.notification?.title}');
}

final pushNotificationServiceProvider = Provider<PushNotificationService>(
  (ref) => PushNotificationService(ref.watch(apiServiceProvider)),
);

class PushNotificationService {
  PushNotificationService(this._api);

  final ApiService _api;
  String? _cachedToken;

  static Future<void> bootstrap() async {
    if (!DefaultFirebaseOptions.isConfigured) {
      debugPrint('FCM: skipped (no dart-define Firebase config)');
      return;
    }
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
  }

  Future<void> registerAfterAuth() async {
    if (!DefaultFirebaseOptions.isConfigured) return;
    final messaging = FirebaseMessaging.instance;
    await messaging.requestPermission(alert: true, badge: true, sound: true);

    final token = await messaging.getToken();
    if (token == null) return;
    _cachedToken = token;

    final platform = Platform.isAndroid
        ? 'ANDROID'
        : Platform.isIOS
            ? 'IOS'
            : 'OTHER';

    await _api.post('/devices/register', {
      'token': token,
      'platform': platform,
    });

    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) async {
      _cachedToken = newToken;
      await _api.post('/devices/register', {
        'token': newToken,
        'platform': platform,
      });
    });
  }

  Future<void> unregister() async {
    final token = _cachedToken;
    if (token != null) {
      try {
        await _api.delete('/devices/register', body: {'token': token});
      } catch (_) {}
    }
    _cachedToken = null;
    if (DefaultFirebaseOptions.isConfigured) {
      await FirebaseMessaging.instance.deleteToken();
    }
  }

  void listenForeground(void Function(RemoteMessage) onMessage) {
    if (!DefaultFirebaseOptions.isConfigured) return;
    FirebaseMessaging.onMessage.listen(onMessage);
  }
}
