import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/api_service.dart';
import '../../core/services/vyra_ai_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/neon_button.dart';
import '../../core/widgets/particle_background.dart';

class SocialEnergyScreen extends ConsumerStatefulWidget {
  const SocialEnergyScreen({super.key});

  @override
  ConsumerState<SocialEnergyScreen> createState() => _SocialEnergyScreenState();
}

class _SocialEnergyScreenState extends ConsumerState<SocialEnergyScreen> {
  Map<String, dynamic>? _data;
  String? _coach;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/social-energy');
      setState(() => _data = res['data'] as Map<String, dynamic>?);
    } catch (_) {}
  }

  Future<void> _coachAi() async {
    final score = _data?['score'] ?? 50;
    final r = await ref.read(vyraAiServiceProvider).invoke(
          capability: 'growth_coach',
          text: 'My social energy score is $score',
        );
    setState(() => _coach = r.output);
  }

  @override
  Widget build(BuildContext context) {
    final score = (_data?['score'] as num?)?.toInt() ?? 50;

    return Scaffold(
      appBar: AppBar(title: const Text('Social Energy')),
      body: ParticleBackground(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            GlassPanel(
              child: Column(
                children: [
                  SizedBox(
                    height: 120,
                    width: 120,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        CircularProgressIndicator(
                          value: score / 100,
                          strokeWidth: 10,
                          color: AppColors.plasmaGold,
                          backgroundColor: AppColors.surface,
                        ),
                        Text('$score', style: Theme.of(context).textTheme.headlineMedium),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  NeonButton(label: 'Growth Coach AI', onPressed: _coachAi),
                  if (_coach != null) ...[
                    const SizedBox(height: 12),
                    Text(_coach!, textAlign: TextAlign.center),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
