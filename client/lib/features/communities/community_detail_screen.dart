import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/services/api_service.dart';
import '../../core/widgets/glass_panel.dart';

class CommunityDetailScreen extends ConsumerStatefulWidget {
  const CommunityDetailScreen({
    super.key,
    required this.communityId,
    required this.name,
  });

  final String communityId;
  final String name;

  @override
  ConsumerState<CommunityDetailScreen> createState() => _CommunityDetailScreenState();
}

class _CommunityDetailScreenState extends ConsumerState<CommunityDetailScreen> {
  List<dynamic> _threads = [];
  final _title = TextEditingController();
  final _content = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final res = await ref
        .read(apiServiceProvider)
        .get('/communities/${widget.communityId}/threads');
    setState(() => _threads = (res['data'] as List?) ?? []);
  }

  Future<void> _postThread() async {
    await ref.read(apiServiceProvider).post(
      '/communities/${widget.communityId}/threads',
      {'title': _title.text.trim(), 'content': _content.text.trim()},
    );
    _title.clear();
    _content.clear();
    await _load();
  }

  Future<void> _vote(String threadId) async {
    await ref.read(apiServiceProvider).post('/community-threads/$threadId/vote', {'value': 1});
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.name)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          GlassPanel(
            child: Column(
              children: [
                TextField(controller: _title, decoration: const InputDecoration(labelText: 'Thread title')),
                TextField(controller: _content, decoration: const InputDecoration(labelText: 'Content')),
                TextButton(onPressed: _postThread, child: const Text('Post thread')),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ..._threads.map((t) {
            final thread = t as Map<String, dynamic>;
            final votes = (thread['_count'] as Map?)?['votes'] ?? 0;
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: GlassPanel(
                child: ListTile(
                  title: Text(thread['title']?.toString() ?? ''),
                  subtitle: Text(thread['content']?.toString() ?? ''),
                  trailing: TextButton(
                    onPressed: () => _vote(thread['id'].toString()),
                    child: Text('▲ $votes'),
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
