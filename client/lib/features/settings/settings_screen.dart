import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:local_auth/local_auth.dart';
import '../auth/auth_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          const ListTile(
            title: Text('Features', style: TextStyle(fontWeight: FontWeight.w600)),
          ),
          ListTile(
            leading: const Icon(Icons.auto_awesome_outlined),
            title: const Text('AI Hub'),
            onTap: () => context.push('/ai-hub'),
          ),
          ListTile(
            leading: const Icon(Icons.mic_outlined),
            title: const Text('Voice assistant'),
            onTap: () => context.push('/voice-nebula'),
          ),
          ListTile(
            leading: const Icon(Icons.public),
            title: const Text('Vyra Worlds'),
            onTap: () => context.push('/vyra-worlds'),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard_outlined),
            title: const Text('Reality boards'),
            onTap: () => context.push('/reality-board'),
          ),
          ListTile(
            leading: const Icon(Icons.flag_outlined),
            title: const Text('Dream board'),
            onTap: () => context.push('/dream-board'),
          ),
          const Divider(),
          const ListTile(
            title: Text('Social', style: TextStyle(fontWeight: FontWeight.w600)),
          ),
          ListTile(
            leading: const Icon(Icons.groups_outlined),
            title: const Text('Groups'),
            onTap: () => context.push('/groups'),
          ),
          ListTile(
            leading: const Icon(Icons.hub_outlined),
            title: const Text('Communities'),
            onTap: () => context.push('/communities'),
          ),
          ListTile(
            leading: const Icon(Icons.videocam_outlined),
            title: const Text('Reels'),
            onTap: () => context.push('/reels'),
          ),
          ListTile(
            leading: const Icon(Icons.auto_stories_outlined),
            title: const Text('Stories'),
            onTap: () => context.push('/stories'),
          ),
          const Divider(),
          const ListTile(
            title: Text('Account', style: TextStyle(fontWeight: FontWeight.w600)),
          ),
          ListTile(
            leading: const Icon(Icons.person_outline),
            title: const Text('Edit profile'),
            onTap: () => context.push('/edit-profile'),
          ),
          ListTile(
            leading: const Icon(Icons.notifications_outlined),
            title: const Text('Notifications'),
            onTap: () => context.push('/notifications'),
          ),
          ListTile(
            leading: const Icon(Icons.fingerprint),
            title: const Text('Biometric lock'),
            onTap: () async {
              final auth = LocalAuthentication();
              final ok = await auth.authenticate(
                localizedReason: 'Unlock VYRA',
                options: const AuthenticationOptions(biometricOnly: true),
              );
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(ok ? 'Verified' : 'Could not verify')),
                );
              }
            },
          ),
          ListTile(
            leading: const Icon(Icons.analytics_outlined),
            title: const Text('Analytics'),
            onTap: () => context.push('/analytics'),
          ),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.redAccent),
            title: const Text('Sign out'),
            onTap: () async {
              await ref.read(authStateProvider.notifier).logout();
              if (context.mounted) context.go('/login');
            },
          ),
        ],
      ),
    );
  }
}
