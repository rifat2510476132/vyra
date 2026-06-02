import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/services/vyra_api.dart';
import '../../core/services/api_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/mood_selector.dart';

final moodFeedProvider = FutureProvider.autoDispose.family<List<dynamic>, String>((ref, mood) async {
  return ref.watch(vyraApiProvider).homeFeed(mood: mood);
});

class FeedScreen extends ConsumerStatefulWidget {
  const FeedScreen({super.key});

  @override
  ConsumerState<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends ConsumerState<FeedScreen> {
  String _mood = 'SOCIAL';

  @override
  Widget build(BuildContext context) {
    final feed = ref.watch(moodFeedProvider(_mood));

    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text('Feed', style: Theme.of(context).textTheme.headlineSmall),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: MoodSelector(
              selected: _mood,
              onSelected: (m) {
                setState(() => _mood = m);
                ref.read(vyraApiProvider).setMood(m);
              },
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: feed.when(
              data: (posts) {
                if (posts.isEmpty) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Text(
                        'No posts yet.\nTap + in the menu to create your first post.',
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: posts.length,
                  itemBuilder: (_, i) {
                    final p = posts[i] as Map<String, dynamic>;
                    final author = p['author'] as Map<String, dynamic>?;
                    final profile = author?['profile'] as Map<String, dynamic>?;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: _PostCard(
                        post: p,
                        authorName: profile?['displayName']?.toString() ?? 'Traveler',
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    e.toString().contains('401')
                        ? 'Session expired. Please login again.'
                        : 'Feed offline: $e',
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PostCard extends ConsumerStatefulWidget {
  const _PostCard({required this.post, required this.authorName});

  final Map<String, dynamic> post;
  final String authorName;

  @override
  ConsumerState<_PostCard> createState() => _PostCardState();
}

class _PostCardState extends ConsumerState<_PostCard> {
  late int _likeCount;
  late int _commentCount;
  bool _liked = false;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    final reactions = (widget.post['reactions'] as List?) ?? const [];
    final comments = (widget.post['comments'] as List?) ?? const [];
    _likeCount = reactions.length;
    _commentCount = comments.length;
  }

  Future<void> _like() async {
    if (_busy) return;
    setState(() {
      _busy = true;
      if (!_liked) {
        _liked = true;
        _likeCount++;
      }
    });
    try {
      await ref.read(apiServiceProvider).post(
            '/posts/${widget.post['id']}/react',
            {'reactionType': 'LIKE'},
          );
    } catch (e) {
      if (mounted) {
        setState(() {
          if (_liked) {
            _liked = false;
            _likeCount = _likeCount > 0 ? _likeCount - 1 : 0;
          }
        });
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Like failed: $e')));
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _comment() async {
    final ctl = TextEditingController();
    final content = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add comment'),
        content: TextField(
          controller: ctl,
          autofocus: true,
          maxLines: 3,
          decoration: const InputDecoration(hintText: 'Write something...'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          FilledButton(
            onPressed: () => Navigator.pop(context, ctl.text.trim()),
            child: const Text('Post'),
          ),
        ],
      ),
    );
    if (content == null || content.isEmpty) return;
    try {
      await ref.read(apiServiceProvider).post(
            '/posts/${widget.post['id']}/comments',
            {'content': content},
          );
      if (mounted) {
        setState(() => _commentCount++);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Comment posted')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Comment failed: $e')));
      }
    }
  }

  Future<void> _share() async {
    final postId = widget.post['id']?.toString() ?? '';
    final text = widget.post['content']?.toString() ?? '';
    final link = 'https://vyra.app/post/$postId';
    await Clipboard.setData(ClipboardData(text: '$text\n$link'));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Post link copied. You can paste and share now.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.post;
    return GlassPanel(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(widget.authorName, style: Theme.of(context).textTheme.labelLarge),
          if (p['emotionSignature'] != null)
            Text(
              '✦ ${p['emotionSignature']}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          const SizedBox(height: 8),
          Text(p['content']?.toString() ?? ''),
          if ((p['mediaUrl']?.toString().isNotEmpty ?? false)) ...[
            const SizedBox(height: 10),
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                p['mediaUrl'].toString(),
                height: 180,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const SizedBox.shrink(),
              ),
            ),
          ],
          const SizedBox(height: 8),
          Row(
            children: [
              TextButton.icon(
                onPressed: _like,
                icon: Icon(_liked ? Icons.favorite : Icons.favorite_border),
                label: Text('Like ($_likeCount)'),
              ),
              TextButton.icon(
                onPressed: _comment,
                icon: const Icon(Icons.chat_bubble_outline),
                label: Text('Comment ($_commentCount)'),
              ),
              TextButton.icon(
                onPressed: _share,
                icon: const Icon(Icons.share_outlined),
                label: const Text('Share'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
