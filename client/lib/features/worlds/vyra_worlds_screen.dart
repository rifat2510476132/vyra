import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/services/api_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/particle_background.dart';

class VyraWorldsScreen extends ConsumerStatefulWidget {
  const VyraWorldsScreen({super.key});

  @override
  ConsumerState<VyraWorldsScreen> createState() => _VyraWorldsScreenState();
}

class _VyraWorldsScreenState extends ConsumerState<VyraWorldsScreen> {
  List<dynamic> _worlds = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final res = await ref.read(apiServiceProvider).get('/worlds');
    setState(() => _worlds = (res['data'] as List?) ?? []);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Vyra Worlds')),
      body: ParticleBackground(
        child: RefreshIndicator(
          onRefresh: _load,
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: _worlds.length,
            itemBuilder: (_, i) {
              final w = _worlds[i] as Map<String, dynamic>;
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: GlassPanel(
                  child: ListTile(
                    leading: w['coverUrl'] != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: CachedNetworkImage(
                              imageUrl: w['coverUrl'].toString(),
                              width: 48,
                              height: 48,
                              fit: BoxFit.cover,
                            ),
                          )
                        : const Icon(Icons.public),
                    title: Text(w['name']?.toString() ?? 'World'),
                    subtitle: Text(w['description']?.toString() ?? ''),
                    trailing: Text('${w['memberCount'] ?? 0}'),
                    onTap: () async {
                      await ref.read(apiServiceProvider).post('/worlds/${w['id']}/join', {});
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Entered world')),
                        );
                      }
                    },
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
