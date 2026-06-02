import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/api_service.dart';
import '../../core/services/vyra_ai_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/particle_background.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _q = TextEditingController();
  Map<String, dynamic>? _lens;
  List<dynamic> _users = const [];
  List<dynamic> _posts = const [];

  Future<void> _search() async {
    final query = _q.text.trim();
    if (query.isEmpty) return;
    final lens = await ref.read(vyraAiServiceProvider).invoke(
          capability: 'smart_search_lens',
          text: query,
        );
    setState(() => _lens = lens.structured);
    try {
      final res = await ref.read(apiServiceProvider).get('/search', query: {'q': query});
      final data = res['data'] as Map<String, dynamic>?;
      setState(() {
        _users = data?['users'] as List? ?? const [];
        _posts = data?['posts'] as List? ?? const [];
      });
    } catch (_) {}
  }

  Future<void> _startDirect(Map<String, dynamic> user) async {
    final userId = user['id']?.toString();
    if (userId == null || userId.isEmpty) return;
    try {
      final res = await ref.read(apiServiceProvider).post('/conversations/direct', {'userId': userId});
      final data = res['data'] as Map<String, dynamic>?;
      final conversationId = data?['id']?.toString();
      final profile = user['profile'] as Map<String, dynamic>?;
      final name = profile?['displayName']?.toString() ?? user['username']?.toString() ?? 'Signal';
      if (!mounted || conversationId == null || conversationId.isEmpty) return;
      context.push('/chat/$conversationId?title=${Uri.encodeComponent(name)}');
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Cannot start chat: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Intent Search')),
      body: ParticleBackground(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _q,
                decoration: InputDecoration(
                  hintText: 'What are you looking for?',
                  suffixIcon: IconButton(icon: const Icon(Icons.hub), onPressed: _search),
                ),
                onSubmitted: (_) => _search(),
              ),
            ),
            if (_lens != null)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: GlassPanel(
                  child: Text(
                    'Intent: ${_lens!['intent'] ?? _lens}',
                    style: TextStyle(color: AppColors.secondary),
                  ),
                ),
              ),
            Expanded(
              child: ListView(
                children: [
                  if (_users.isNotEmpty) ...[
                    const Padding(
                      padding: EdgeInsets.fromLTRB(16, 8, 16, 0),
                      child: Text('Users'),
                    ),
                    ..._users.map((u) {
                      final user = u as Map<String, dynamic>;
                      final profile = user['profile'] as Map<String, dynamic>?;
                      final name =
                          profile?['displayName']?.toString() ?? user['username']?.toString() ?? 'User';
                      return ListTile(
                        leading: const CircleAvatar(child: Icon(Icons.person_outline)),
                        title: Text(name),
                        subtitle: Text('@${user['username'] ?? ''}'),
                        trailing: const Icon(Icons.chat_bubble_outline),
                        onTap: () => _startDirect(user),
                      );
                    }),
                  ],
                  if (_posts.isNotEmpty) ...[
                    const Padding(
                      padding: EdgeInsets.fromLTRB(16, 8, 16, 0),
                      child: Text('Posts'),
                    ),
                    ..._posts.map((p) {
                      final post = p as Map<String, dynamic>;
                      return ListTile(
                        leading: const Icon(Icons.article_outlined),
                        title: Text(post['content']?.toString() ?? ''),
                      );
                    }),
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
