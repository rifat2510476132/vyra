import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/api_service.dart';
import '../../core/services/vyra_ai_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/neon_button.dart';
import '../../core/widgets/particle_background.dart';

class DreamBoardScreen extends ConsumerStatefulWidget {
  const DreamBoardScreen({super.key});

  @override
  ConsumerState<DreamBoardScreen> createState() => _DreamBoardScreenState();
}

class _DreamBoardScreenState extends ConsumerState<DreamBoardScreen> {
  final _goal = TextEditingController();
  List<dynamic> _boards = const [];
  String? _forgePreview;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/dream-boards');
      setState(() => _boards = (res['data'] as List?) ?? []);
    } catch (_) {}
  }

  Future<void> _forge() async {
    final r = await ref.read(vyraAiServiceProvider).invoke(
          capability: 'dream_forge',
          text: _goal.text,
        );
    setState(() => _forgePreview = r.output);
  }

  Future<void> _create() async {
    await ref.read(apiServiceProvider).post('/dream-boards', {
      'goalText': _goal.text,
      'title': _goal.text.split(' ').take(4).join(' '),
    });
    _goal.clear();
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dream Forge')),
      body: ParticleBackground(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            GlassPanel(
              child: Column(
                children: [
                  TextField(
                    controller: _goal,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      hintText: 'Describe your dream in natural language…',
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: NeonButton(
                          label: 'AI Forge Map',
                          onPressed: _forge,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: NeonButton(
                          label: 'Save Board',
                          onPressed: _create,
                        ),
                      ),
                    ],
                  ),
                  if (_forgePreview != null) ...[
                    const SizedBox(height: 12),
                    Text(_forgePreview!, style: TextStyle(color: AppColors.plasmaGold)),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 16),
            for (final b in _boards)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: GlassPanel(
                  child: ListTile(
                    title: Text((b as Map)['title']?.toString() ?? 'Dream'),
                    subtitle: Text(
                      '${(b['goalText'] ?? '').toString()}\nProgress: ${((b['progress'] as num?) ?? 0) * 100}%',
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
