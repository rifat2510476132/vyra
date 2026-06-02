import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/services/api_service.dart';
import '../../core/services/media_upload_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/neon_button.dart';

class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  final _display = TextEditingController();
  final _bio = TextEditingController();
  final _picker = ImagePicker();
  XFile? _avatarFile;
  Uint8List? _avatarPreview;
  String? _existingAvatarUrl;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/auth/me');
      final user = (res['data'] as Map?)?['user'] as Map?;
      final profile = user?['profile'] as Map?;
      if (!mounted) return;
      setState(() {
        _display.text = profile?['displayName']?.toString() ?? '';
        _bio.text = profile?['bio']?.toString() ?? '';
        _existingAvatarUrl = profile?['avatarUrl']?.toString();
      });
    } catch (_) {}
  }

  Future<void> _pickAvatar() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 85,
    );
    if (picked == null) return;
    final bytes = await picked.readAsBytes();
    setState(() {
      _avatarFile = picked;
      _avatarPreview = bytes;
    });
  }

  @override
  Widget build(BuildContext context) {
    ImageProvider? avatarImage;
    if (_avatarPreview != null) {
      avatarImage = MemoryImage(_avatarPreview!);
    } else if (_existingAvatarUrl != null && _existingAvatarUrl!.isNotEmpty) {
      avatarImage = NetworkImage(_existingAvatarUrl!);
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Edit profile')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: GlassPanel(
          child: Column(
            children: [
              GestureDetector(
                onTap: _pickAvatar,
                child: CircleAvatar(
                  radius: 40,
                  backgroundImage: avatarImage,
                  child: avatarImage == null ? const Icon(Icons.camera_alt_outlined) : null,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _display,
                decoration: const InputDecoration(labelText: 'Display name'),
              ),
              TextField(
                controller: _bio,
                decoration: const InputDecoration(labelText: 'Bio'),
                maxLines: 3,
              ),
              const SizedBox(height: 20),
              NeonButton(
                label: _saving ? 'Saving…' : 'Save',
                onPressed: _saving
                    ? null
                    : () async {
                        setState(() => _saving = true);
                        try {
                          if (_avatarFile != null) {
                            await ref.read(mediaUploadServiceProvider).uploadAvatar(_avatarFile!);
                          }
                          await ref.read(apiServiceProvider).patch('/users/profile', {
                            'displayName': _display.text.trim(),
                            'bio': _bio.text.trim(),
                          });
                          if (context.mounted) Navigator.pop(context);
                        } finally {
                          if (mounted) setState(() => _saving = false);
                        }
                      },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
