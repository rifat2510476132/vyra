import 'package:flutter/material.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:go_router/go_router.dart';

import '../../core/services/api_service.dart';

import '../../core/widgets/glass_panel.dart';

import '../../core/widgets/neon_button.dart';

import '../../core/widgets/particle_background.dart';



class VerifyScreen extends ConsumerStatefulWidget {

  const VerifyScreen({super.key});



  @override

  ConsumerState<VerifyScreen> createState() => _VerifyScreenState();

}



class _VerifyScreenState extends ConsumerState<VerifyScreen> {

  final _code = TextEditingController();



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

                  Text('Verify Signal', style: Theme.of(context).textTheme.headlineMedium),

                  const SizedBox(height: 16),

                  const Text('Enter the code from server logs (dev) or your email.'),

                  const SizedBox(height: 16),

                  TextField(

                    controller: _code,

                    decoration: const InputDecoration(labelText: 'Verification code'),

                  ),

                  const SizedBox(height: 20),

                  NeonButton(

                    label: 'Confirm',

                    onPressed: () async {

                      await ref.read(apiServiceProvider).post('/auth/verify-email', {

                        'code': _code.text.trim(),

                      });

                      if (context.mounted) context.go('/login');

                    },

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


