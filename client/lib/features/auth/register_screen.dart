import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/neon_button.dart';
import '../../core/widgets/particle_background.dart';
import 'auth_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _username = TextEditingController();
  final _display = TextEditingController();

  @override
  Widget build(BuildContext context) {
    ref.listen(authStateProvider, (prev, next) {
      next.whenData((loggedIn) {
        if (loggedIn) context.go('/home');
      });
    });

    return Scaffold(
      body: ParticleBackground(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: GlassPanel(
              child: Column(
                children: [
                  Text('New Identity', style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 16),
                  TextField(controller: _display, decoration: const InputDecoration(labelText: 'Display name')),
                  TextField(controller: _username, decoration: const InputDecoration(labelText: 'Username')),
                  TextField(controller: _email, decoration: const InputDecoration(labelText: 'Email')),
                  TextField(
                    controller: _password,
                    decoration: const InputDecoration(labelText: 'Password'),
                    obscureText: true,
                  ),
                  const SizedBox(height: 20),
                  NeonButton(
                    label: 'Initialize',
                    onPressed: () => ref.read(authStateProvider.notifier).register(
                          email: _email.text.trim(),
                          password: _password.text,
                          username: _username.text.trim(),
                          displayName: _display.text.trim(),
                        ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
