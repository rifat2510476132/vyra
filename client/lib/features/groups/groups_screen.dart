import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/services/api_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/neon_button.dart';
import '../../core/widgets/particle_background.dart';

class GroupsScreen extends ConsumerStatefulWidget {
  const GroupsScreen({super.key});

  @override
  ConsumerState<GroupsScreen> createState() => _GroupsScreenState();
}

class _GroupsScreenState extends ConsumerState<GroupsScreen> {
  List<dynamic> _groups = const [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/groups');
      setState(() => _groups = (res['data'] as List?) ?? []);
    } catch (_) {}
  }

  Future<void> _create() async {
    final res = await ref.read(apiServiceProvider).post('/groups', {
      'name': 'New Collective',
      'description': 'A Vyra group dimension',
    });
    final data = res['data'] as Map<String, dynamic>?;
    final conversationId = data?['conversationId']?.toString();
    final name = data?['name']?.toString() ?? 'Group';
    if (!mounted) return;
    if (conversationId != null && conversationId.isNotEmpty) {
      context.push('/group-chat/$conversationId?name=${Uri.encodeComponent(name)}');
    } else {
      _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Collectives')),
      body: ParticleBackground(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            NeonButton(label: 'Spawn collective', onPressed: _create),
            const SizedBox(height: 16),
            for (final g in _groups)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: GlassPanel(
                  child: ListTile(
                    title: Text((g as Map)['name']?.toString() ?? 'Group'),
                    subtitle: Text('SES: ${g['socialEnergyScore'] ?? 50}'),
                    onTap: () async {
                      var conversationId = g['conversationId']?.toString();
                      if (conversationId == null || conversationId.isEmpty) {
                        final join = await ref
                            .read(apiServiceProvider)
                            .post('/groups/${g['id']}/join', {});
                        final joinData = join['data'] as Map<String, dynamic>?;
                        conversationId = joinData?['conversationId']?.toString();
                      }
                      if (!context.mounted || conversationId == null || conversationId.isEmpty) return;
                      context.push(
                        '/group-chat/$conversationId?name=${Uri.encodeComponent(g['name']?.toString() ?? 'Group')}',
                      );
                    },
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
