import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/api_service.dart';
import '../../core/services/media_upload_service.dart';
import '../../core/services/vyra_ai_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/neon_button.dart';

class CreatePostScreen extends ConsumerStatefulWidget {
  const CreatePostScreen({super.key});

  @override
  ConsumerState<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends ConsumerState<CreatePostScreen> {
  final _content = TextEditingController();
  String _emotionLine = '';
  String _caption = '';
  bool _aiBusy = false;
  bool _uploading = false;
  XFile? _imageFile;
  XFile? _videoFile;
  Uint8List? _imagePreview;
  String? _mediaUrl;
  String _postType = 'TEXT';
  final _pollA = TextEditingController(text: 'Option A');
  final _pollB = TextEditingController(text: 'Option B');
  final _picker = ImagePicker();

  Future<void> _emotionSignature() async {
    setState(() => _aiBusy = true);
    try {
      final r = await ref.read(vyraAiServiceProvider).invoke(
            capability: 'emotion_signature',
            text: _content.text,
          );
      final s = r.structured;
      setState(() {
        _emotionLine = s?['poeticLine']?.toString() ?? r.output;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Emotion Signature unavailable: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _aiBusy = false);
    }
  }

  Future<void> _captionPrism() async {
    setState(() => _aiBusy = true);
    try {
      final r = await ref.read(vyraAiServiceProvider).invoke(
            capability: 'caption_prism',
            text: _content.text,
          );
      setState(() => _caption = r.output);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Caption Prism unavailable: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _aiBusy = false);
    }
  }

  Future<void> _transcend() async {
    setState(() => _aiBusy = true);
    try {
      final r = await ref.read(vyraAiServiceProvider).invoke(
            capability: 'post_transcend',
            text: _content.text,
          );
      _content.text = r.output;
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Post Transcend unavailable: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _aiBusy = false);
    }
  }

  Future<void> _pickImage() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (picked == null) return;
    final bytes = await picked.readAsBytes();
    setState(() {
      _imageFile = picked;
      _imagePreview = bytes;
      _videoFile = null;
      _postType = 'IMAGE';
    });
  }

  Future<void> _pickVideo() async {
    final picked = await _picker.pickVideo(source: ImageSource.gallery);
    if (picked == null) return;
    setState(() {
      _videoFile = picked;
      _imageFile = null;
      _imagePreview = null;
      _postType = 'VIDEO';
    });
  }

  Future<void> _submit() async {
    setState(() => _uploading = true);
    try {
      var mediaUrl = _mediaUrl;
      final upload = ref.read(mediaUploadServiceProvider);
      if (_imageFile != null) {
        mediaUrl = await upload.uploadImage(_imageFile!, purpose: 'post');
      } else if (_videoFile != null) {
        final data = await upload.uploadXFile(_videoFile!, purpose: 'post');
        mediaUrl = data['url'] as String? ?? (data['media'] as Map)['url'] as String;
      }
      final api = ref.read(apiServiceProvider);
      final type = _postType == 'POLL'
          ? 'POLL'
          : (mediaUrl != null ? (_postType == 'VIDEO' ? 'VIDEO' : 'IMAGE') : 'TEXT');
      await api.post('/posts', {
        'type': type,
        'content': _content.text,
        if (mediaUrl != null) 'mediaUrl': mediaUrl,
        if (_emotionLine.isNotEmpty) 'emotionSignature': _emotionLine,
        if (type == 'POLL')
          'pollData': {
            'options': [_pollA.text.trim(), _pollB.text.trim()],
          },
      });
      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Post failed: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _uploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create post')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            GlassPanel(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(
                    controller: _content,
                    maxLines: 6,
                    decoration: const InputDecoration(
                      hintText: 'What do you want to share?',
                    ),
                  ),
                  if (_emotionLine.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        '◎ $_emotionLine',
                        style: TextStyle(color: AppColors.secondary),
                      ),
                    ),
                  if (_caption.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text('Caption: $_caption'),
                    ),
                  if (_imagePreview != null) ...[
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.memory(_imagePreview!, height: 160, fit: BoxFit.cover),
                    ),
                  ],
                  if (_videoFile != null) ...[
                    const SizedBox(height: 12),
                    const ListTile(
                      leading: Icon(Icons.videocam_outlined),
                      title: Text('Video attached'),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 12),
            DropdownButton<String>(
              value: _postType,
              items: const [
                DropdownMenuItem(value: 'TEXT', child: Text('Text')),
                DropdownMenuItem(value: 'IMAGE', child: Text('Image')),
                DropdownMenuItem(value: 'VIDEO', child: Text('Video')),
                DropdownMenuItem(value: 'POLL', child: Text('Poll')),
              ],
              onChanged: _uploading ? null : (v) => setState(() => _postType = v ?? 'TEXT'),
            ),
            if (_postType == 'POLL') ...[
              TextField(controller: _pollA, decoration: const InputDecoration(labelText: 'Option A')),
              TextField(controller: _pollB, decoration: const InputDecoration(labelText: 'Option B')),
            ],
            OutlinedButton.icon(
              onPressed: _uploading ? null : _pickImage,
              icon: const Icon(Icons.photo_library_outlined),
              label: Text(_imageFile == null ? 'Attach image' : 'Change image'),
            ),
            OutlinedButton.icon(
              onPressed: _uploading ? null : _pickVideo,
              icon: const Icon(Icons.videocam_outlined),
              label: Text(_videoFile == null ? 'Attach video' : 'Change video'),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _AiChip(label: 'Emotion Signature', loading: _aiBusy, onTap: _emotionSignature),
                _AiChip(label: 'Caption Prism', loading: _aiBusy, onTap: _captionPrism),
                _AiChip(label: 'Post Transcend', loading: _aiBusy, onTap: _transcend),
              ],
            ),
            const SizedBox(height: 16),
            NeonButton(
              label: _uploading ? 'Uploading…' : 'Post',
              onPressed: _uploading ? null : _submit,
            ),
          ],
        ),
      ),
    );
  }
}

class _AiChip extends StatelessWidget {
  const _AiChip({required this.label, required this.onTap, required this.loading});

  final String label;
  final VoidCallback onTap;
  final bool loading;

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      label: Text(loading ? '…' : label),
      onPressed: loading ? null : onTap,
      backgroundColor: AppColors.primary.withValues(alpha: 0.35),
    );
  }
}
