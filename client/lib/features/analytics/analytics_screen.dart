import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/services/api_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/particle_background.dart';

class AnalyticsScreen extends ConsumerStatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  ConsumerState<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends ConsumerState<AnalyticsScreen> {
  Map<String, dynamic>? _creator;
  Map<String, dynamic>? _trends;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final api = ref.read(apiServiceProvider);
      final c = await api.get('/analytics/creator');
      final t = await api.get('/analytics/trends');
      setState(() {
        _creator = c['data'] as Map<String, dynamic>?;
        _trends = t['data'] as Map<String, dynamic>?;
      });
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Creator Resonance')),
      body: ParticleBackground(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            GlassPanel(
              child: Text('Posts: ${_creator?['posts'] ?? '—'}'),
            ),
            const SizedBox(height: 12),
            GlassPanel(
              child: Text('Trending: ${_trends?['topics'] ?? '—'}'),
            ),
          ],
        ),
      ),
    );
  }
}
