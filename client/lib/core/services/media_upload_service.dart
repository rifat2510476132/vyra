import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http_parser/http_parser.dart';
import 'package:image_picker/image_picker.dart';
import 'api_service.dart';

final mediaUploadServiceProvider =
    Provider<MediaUploadService>((ref) => MediaUploadService(ref.watch(apiServiceProvider)));

class MediaUploadService {
  MediaUploadService(this._api);

  final ApiService _api;

  Future<MultipartFile> _multipartFromXFile(XFile file) async {
    final bytes = await file.readAsBytes();
    final name = file.name.isNotEmpty ? file.name : 'upload.bin';
    final mime = file.mimeType ?? _guessMime(name);
    return MultipartFile.fromBytes(
      bytes,
      filename: name,
      contentType: MediaType.parse(mime),
    );
  }

  String _guessMime(String name) {
    final lower = name.toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.gif')) return 'image/gif';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.mp4')) return 'video/mp4';
    return 'application/octet-stream';
  }

  Future<Map<String, dynamic>> uploadXFile(
    XFile file, {
    String purpose = 'post',
  }) async {
    final form = FormData.fromMap({
      'purpose': purpose,
      'file': await _multipartFromXFile(file),
    });
    final res = await _api.postMultipart('/media/upload', form);
    return (res['data'] as Map<String, dynamic>?) ?? res;
  }

  Future<String> uploadImage(XFile file, {String purpose = 'post'}) async {
    final data = await uploadXFile(file, purpose: purpose);
    return data['url'] as String? ?? (data['media'] as Map)['url'] as String;
  }

  Future<String> uploadAvatar(XFile file) async {
    final form = FormData.fromMap({
      'file': await _multipartFromXFile(file),
    });
    final res = await _api.postMultipart('/media/avatar', form);
    final data = (res['data'] as Map<String, dynamic>?) ?? res;
    return data['url'] as String;
  }
}
