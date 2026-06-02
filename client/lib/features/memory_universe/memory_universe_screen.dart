import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/animations/neural_core_painter.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/api_service.dart';
import '../../core/services/vyra_ai_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/neon_button.dart';

class MemoryUniverseScreen extends ConsumerStatefulWidget {
  const MemoryUniverseScreen({super.key});

  @override
  ConsumerState<MemoryUniverseScreen> createState() => _MemoryUniverseScreenState();
}

class _MemoryUniverseScreenState extends ConsumerState<MemoryUniverseScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _anim;
  List<dynamic> _memories = const [];
  String? _weaverText;

  @override
  void initState() {
    super.initState();
    _anim = AnimationController(vsync: this, duration: const Duration(seconds: 20))..repeat();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/memory-universe');
      setState(() => _memories = (res['data'] as List?) ?? []);
    } catch (_) {}
  }

  Future<void> _weave() async {
    final titles = _memories.map((m) => (m as Map)['title']?.toString() ?? '').join('; ');
    final r = await ref.read(vyraAiServiceProvider).invoke(
          capability: 'memory_weaver',
          text: titles.isEmpty ? 'Empty constellation' : titles,
        );
    setState(() => _weaverText = r.output);
  }

  @override
  void dispose() {
    _anim.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Memory Universe')),
      body: Stack(
        children: [
          AnimatedBuilder(
            animation: _anim,
            builder: (_, __) => CustomPaint(
              painter: NeuralCorePainter(t: _anim.value, pulse: 0.4),
              size: Size.infinite,
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: NeonButton(label: 'Memory Weaver AI', onPressed: _weave),
                ),
                if (_weaverText != null)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(_weaverText!, style: TextStyle(color: AppColors.secondary)),
                  ),
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _memories.length,
                    itemBuilder: (_, i) {
                      final m = _memories[i] as Map<String, dynamic>;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: GlassPanel(
                          child: ListTile(
                            title: Text(m['title']?.toString() ?? 'Memory'),
                            subtitle: Text(m['emotionTag']?.toString() ?? ''),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
