/// Application-wide constants for Vyra 2125.
class AppConstants {
  AppConstants._();

  static const String appName = 'Vyra';
  static const String appTagline = 'Quantum Social 2125';
  static const String hiveBoxName = 'vyra_box';
  static const String authTokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userIdKey = 'user_id';
  static const String onboardingCompleteKey = 'onboarding_complete';
  static const String themeModeKey = 'theme_mode';

  static const int splashDurationMs = 2800;
  static const int onboardingPageCount = 4;

  static const List<String> orbitalNavLabels = [
    'Feed',
    'Explore',
    'Create',
    'Messages',
    'Profile',
  ];
}
