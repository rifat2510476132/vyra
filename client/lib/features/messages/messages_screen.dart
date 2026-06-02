import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/services/api_service.dart';
import '../../core/services/storage_service.dart';
import '../../core/widgets/glass_panel.dart';

class MessagesScreen extends ConsumerStatefulWidget {
  const MessagesScreen({super.key});

  @override
  ConsumerState<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends ConsumerState<MessagesScreen> {
  List<dynamic> _items = [];
  bool _loading = true;
  Set<String> _pinned = {};

  @override
  void initState() {
    super.initState();
    _loadPinned();
    _load();
  }

  void _loadPinned() {
    final saved = StorageService.instance.readPref<List>('pinned_conversations');
    _pinned = (saved ?? const []).map((e) => e.toString()).toSet();
  }

  Future<void> _togglePin(String id) async {
    final next = Set<String>.from(_pinned);
    if (next.contains(id)) {
      next.remove(id);
    } else {
      next.add(id);
    }
    await StorageService.instance.writePref('pinned_conversations', next.toList());
    if (mounted) setState(() => _pinned = next);
  }

  Future<void> _load() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/conversations');
      setState(() {
        _items = (res['data'] as List?) ?? [];
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  String _titleFor(Map<String, dynamic> membership) {
    final conv = membership['conversation'] as Map<String, dynamic>?;
    final members = conv?['members'] as List? ?? [];
    for (final m in members) {
      final user = (m as Map)['user'] as Map?;
      final profile = user?['profile'] as Map?;
      final name = profile?['displayName'] ?? user?['username'];
      if (name != null) return name.toString();
    }
    return conv?['name']?.toString() ?? 'Signal';
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const SafeArea(child: Center(child: CircularProgressIndicator()));
    }
    final sortedItems = _items.cast<Map<String, dynamic>>().toList()
      ..sort((a, b) {
        final aId = (a['conversation'] as Map?)?['id']?.toString() ?? '';
        final bId = (b['conversation'] as Map?)?['id']?.toString() ?? '';
        final ap = _pinned.contains(aId) ? 1 : 0;
        final bp = _pinned.contains(bId) ? 1 : 0;
        return bp.compareTo(ap);
      });

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: _load,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text('Messages', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 16),
            if (_items.isEmpty)
              const GlassPanel(child: ListTile(title: Text('No conversations yet'))),
            ...sortedItems.map((item) {
              final m = item;
              final conv = m['conversation'] as Map<String, dynamic>;
              final id = conv['id'].toString();
              final msgs = conv['messages'] as List?;
              final preview = msgs?.isNotEmpty == true
                  ? (msgs!.first as Map)['content']?.toString() ?? 'Media'
                  : 'Start transmitting';
              final lastReadAt = DateTime.tryParse(m['lastReadAt']?.toString() ?? '');
              final lastMessageAt = msgs?.isNotEmpty == true
                  ? DateTime.tryParse((msgs!.first as Map)['createdAt']?.toString() ?? '')
                  : null;
              final unread = lastMessageAt != null && (lastReadAt == null || lastMessageAt.isAfter(lastReadAt));
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: GlassPanel(
                  child: ListTile(
                    leading: Stack(
                      children: [
                        const CircleAvatar(child: Icon(Icons.bolt)),
                        if (unread)
                          const Positioned(
                            right: 0,
                            top: 0,
                            child: CircleAvatar(radius: 5, backgroundColor: Colors.redAccent),
                          ),
                      ],
                    ),
                    title: Text(_titleFor(m)),
                    subtitle: Text(preview),
                    trailing: IconButton(
                      icon: Icon(_pinned.contains(id) ? Icons.push_pin : Icons.push_pin_outlined),
                      onPressed: () => _togglePin(id),
                    ),
                    onTap: () => context.push(
                      '/chat/$id?title=${Uri.encodeComponent(_titleFor(m))}',
                    ),
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
