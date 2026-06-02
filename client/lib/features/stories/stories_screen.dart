import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/services/api_service.dart';
import '../../core/services/media_upload_service.dart';

class StoriesScreen extends ConsumerStatefulWidget {
  const StoriesScreen({super.key});

  @override
  ConsumerState<StoriesScreen> createState() => _StoriesScreenState();
}

class _StoriesScreenState extends ConsumerState<StoriesScreen> {
  List<dynamic> _stories = const [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/stories');
      setState(() => _stories = (res['data'] as List?) ?? []);
    } catch (_) {}
  }

  Future<void> _addStory() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (picked == null) return;
    final url = await ref.read(mediaUploadServiceProvider).uploadImage(picked, purpose: 'story');
    await ref.read(apiServiceProvider).post('/stories', {'mediaUrl': url, 'caption': 'Echo'});
    await _load();
  }

  void _viewStory(Map<String, dynamic> story) {
    final url = story['mediaUrl']?.toString();
    showDialog(
      context: context,
      builder: (_) => Dialog(
        child: url != null
            ? Image.network(url, fit: BoxFit.contain)
            : Text(story['caption']?.toString() ?? ''),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Stories')),
      floatingActionButton: FloatingActionButton(onPressed: _addStory, child: const Icon(Icons.add)),
      body: _stories.isEmpty
          ? const Center(child: Text('No stories yet — tap + to add one'))
          : ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.all(16),
              children: [
                for (final s in _stories)
                  GestureDetector(
                    onTap: () => _viewStory(s as Map<String, dynamic>),
                    child: Container(
                      width: 100,
                      margin: const EdgeInsets.only(right: 12),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.cyanAccent, width: 2),
                        image: (s as Map)['mediaUrl'] != null
                            ? DecorationImage(
                                image: NetworkImage(s['mediaUrl'].toString()),
                                fit: BoxFit.cover,
                              )
                            : null,
                        gradient: (s)['mediaUrl'] == null
                            ? const LinearGradient(
                                colors: [Color(0xFF7B2FBE), Color(0xFF00D4FF)],
                              )
                            : null,
                      ),
                      child: Center(
                        child: Text(
                          s['caption']?.toString().substring(0, 1) ?? '?',
                          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
    );
  }
}
