import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/services/api_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/particle_background.dart';

class CommunitiesScreen extends ConsumerStatefulWidget {
  const CommunitiesScreen({super.key});

  @override
  ConsumerState<CommunitiesScreen> createState() => _CommunitiesScreenState();
}

class _CommunitiesScreenState extends ConsumerState<CommunitiesScreen> {
  List<dynamic> _items = const [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/communities');
      setState(() {
        _items = (res['data'] as List?) ?? [];
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Organic Collectives')),
      body: ParticleBackground(
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _items.length,
                itemBuilder: (_, i) {
                  final c = _items[i] as Map<String, dynamic>;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GlassPanel(
                      child: ListTile(
                        title: Text(c['name']?.toString() ?? 'Collective'),
                        subtitle: Text(c['description']?.toString() ?? ''),
                        trailing: c['isAiCreated'] == true
                            ? const Icon(Icons.auto_awesome, color: Colors.amber)
                            : const Icon(Icons.chevron_right),
                        onTap: () => context.push(
                          '/community/${c['id']}?name=${Uri.encodeComponent(c['name']?.toString() ?? '')}',
                        ),
                        onLongPress: () async {
                          await ref.read(apiServiceProvider).post('/communities/${c['id']}/join', {});
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Joined collective')),
                            );
                          }
                        },
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
