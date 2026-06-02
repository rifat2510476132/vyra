import 'package:flutter/material.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:go_router/go_router.dart';

import '../../core/services/api_service.dart';

import '../../core/widgets/glass_panel.dart';

import '../../core/widgets/neon_button.dart';

import '../../core/widgets/particle_background.dart';



class ForgotPasswordScreen extends ConsumerStatefulWidget {

  const ForgotPasswordScreen({super.key});



  @override

  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();

}



class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {

  final _email = TextEditingController();

  final _token = TextEditingController();

  final _password = TextEditingController();

  bool _showReset = false;



  @override

  Widget build(BuildContext context) {

    return Scaffold(

      body: ParticleBackground(

        child: SafeArea(

          child: Padding(

            padding: const EdgeInsets.all(24),

            child: GlassPanel(

              child: Column(

                mainAxisSize: MainAxisSize.min,

                children: [

                  Text('Recover Access', style: Theme.of(context).textTheme.headlineMedium),

                  const SizedBox(height: 16),

                  if (!_showReset) ...[

                    TextField(

                      controller: _email,

                      decoration: const InputDecoration(labelText: 'Email'),

                      keyboardType: TextInputType.emailAddress,

                    ),

                    const SizedBox(height: 20),

                    NeonButton(

                      label: 'Send reset token',

                      onPressed: () async {

                        await ref.read(apiServiceProvider).post('/auth/forgot-password', {

                          'email': _email.text.trim(),

                        });

                        if (mounted) {

                          ScaffoldMessenger.of(context).showSnackBar(

                            const SnackBar(

                              content: Text('Check server logs for token (dev mode)'),

                            ),

                          );

                          setState(() => _showReset = true);

                        }

                      },

                    ),

                  ] else ...[

                    TextField(controller: _token, decoration: const InputDecoration(labelText: 'Token')),

                    TextField(

                      controller: _password,

                      obscureText: true,

                      decoration: const InputDecoration(labelText: 'New password'),

                    ),

                    const SizedBox(height: 20),

                    NeonButton(

                      label: 'Reset password',

                      onPressed: () async {

                        await ref.read(apiServiceProvider).post('/auth/reset-password', {

                          'token': _token.text.trim(),

                          'password': _password.text,

                        });

                        if (mounted) context.go('/login');

                      },

                    ),

                  ],

                ],

              ),

            ),

          ),

        ),

      ),

    );

  }

}


