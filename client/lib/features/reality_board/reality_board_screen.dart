import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/services/api_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/neon_button.dart';
import '../../core/widgets/particle_background.dart';

class RealityBoardScreen extends ConsumerStatefulWidget {
  const RealityBoardScreen({super.key});

  @override
  ConsumerState<RealityBoardScreen> createState() => _RealityBoardScreenState();
}

class _RealityBoardScreenState extends ConsumerState<RealityBoardScreen> {
  List<dynamic> _boards = [];
  final _title = TextEditingController();
  final _vision = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final res = await ref.read(apiServiceProvider).get('/reality-boards');
    setState(() => _boards = (res['data'] as List?) ?? []);
  }

  Future<void> _create() async {
    await ref.read(apiServiceProvider).post('/reality-boards', {
      'title': _title.text.trim(),
      'visionText': _vision.text.trim(),
      'pillars': ['Focus', 'Flow', 'Future'],
      'isPublic': true,
    });
    _title.clear();
    _vision.clear();
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reality Boards')),
      body: ParticleBackground(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            GlassPanel(
              child: Column(
                children: [
                  TextField(controller: _title, decoration: const InputDecoration(labelText: 'Board title')),
                  TextField(
                    controller: _vision,
                    maxLines: 3,
                    decoration: const InputDecoration(labelText: 'Vision'),
                  ),
                  const SizedBox(height: 12),
                  NeonButton(label: 'Manifest board', onPressed: _create),
                ],
              ),
            ),
            const SizedBox(height: 16),
            ..._boards.map((b) {
              final board = b as Map<String, dynamic>;
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: GlassPanel(
                  child: ListTile(
                    title: Text(board['title']?.toString() ?? ''),
                    subtitle: Text(board['visionText']?.toString() ?? ''),
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
