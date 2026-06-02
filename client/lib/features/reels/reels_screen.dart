import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:video_player/video_player.dart';
import '../../core/services/api_service.dart';
import '../../core/services/media_upload_service.dart';
import '../../core/widgets/particle_background.dart';

class ReelsScreen extends ConsumerStatefulWidget {
  const ReelsScreen({super.key});

  @override
  ConsumerState<ReelsScreen> createState() => _ReelsScreenState();
}

class _ReelsScreenState extends ConsumerState<ReelsScreen> {
  final _page = PageController();
  List<dynamic> _reels = const [];
  VideoPlayerController? _player;
  int _current = 0;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _player?.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/reels');
      setState(() => _reels = (res['data'] as List?) ?? []);
      if (_reels.isNotEmpty) _playAt(0);
    } catch (_) {}
  }

  Future<void> _playAt(int index) async {
    _player?.dispose();
    final r = _reels[index] as Map<String, dynamic>;
    final url = r['videoUrl']?.toString();
    if (url == null || url.isEmpty) return;
    _player = VideoPlayerController.networkUrl(Uri.parse(url))
      ..initialize().then((_) {
        if (mounted) {
          setState(() {});
          _player?.play();
          _player?.setLooping(true);
        }
      });
    setState(() => _current = index);
  }

  Future<void> _uploadReel() async {
    final picked = await ImagePicker().pickVideo(source: ImageSource.gallery);
    if (picked == null) return;
    final data = await ref.read(mediaUploadServiceProvider).uploadXFile(picked, purpose: 'post');
    final url = data['url'] as String? ?? (data['media'] as Map)['url'] as String;
    await ref.read(apiServiceProvider).post('/reels', {'videoUrl': url, 'caption': 'New pulse'});
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: _uploadReel,
        child: const Icon(Icons.add),
      ),
      body: ParticleBackground(
        child: PageView.builder(
          controller: _page,
          scrollDirection: Axis.vertical,
          onPageChanged: _playAt,
          itemCount: _reels.isEmpty ? 1 : _reels.length,
          itemBuilder: (_, i) {
            if (_reels.isEmpty) {
              return const Center(child: Text('No pulse streams yet — tap + to upload'));
            }
            final r = _reels[i] as Map<String, dynamic>;
            final showPlayer = i == _current && _player?.value.isInitialized == true;
            return Stack(
              fit: StackFit.expand,
              children: [
                if (showPlayer)
                  FittedBox(
                    fit: BoxFit.cover,
                    child: SizedBox(
                      width: _player!.value.size.width,
                      height: _player!.value.size.height,
                      child: VideoPlayer(_player!),
                    ),
                  )
                else
                  Container(color: Colors.black54),
                Positioned(
                  left: 16,
                  bottom: 48,
                  child: Text(
                    r['caption']?.toString() ?? 'Pulse',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
