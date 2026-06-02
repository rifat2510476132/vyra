import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/ai_capability.dart';
import 'api_service.dart';

final vyraAiServiceProvider = Provider<VyraAiService>((ref) => VyraAiService(ref.watch(apiServiceProvider)));

class VyraAiResult {
  VyraAiResult({
    required this.output,
    this.structured,
    this.energySignature,
    this.poweredBy,
  });

  final String output;
  final Map<String, dynamic>? structured;
  final String? energySignature;
  final String? poweredBy;

  factory VyraAiResult.fromJson(Map<String, dynamic> json) {
    return VyraAiResult(
      output: json['output']?.toString() ?? '',
      structured: json['structured'] as Map<String, dynamic>?,
      energySignature: json['energySignature']?.toString(),
      poweredBy: json['poweredBy']?.toString(),
    );
  }
}

class VyraAiService {
  VyraAiService(this._api);
  final ApiService _api;

  Future<List<AiCapability>> manifest() async {
    final res = await _api.get('/ai/hub');
    final data = res['data'] as Map<String, dynamic>;
    final list = data['capabilities'] as List<dynamic>? ?? [];
    return list.map((e) => AiCapability.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<VyraAiResult> invoke({
    required String capability,
    String? text,
    String? mood,
    Map<String, dynamic>? context,
  }) async {
    final res = await _api.post('/ai/invoke', {
      'capability': capability,
      if (text != null) 'text': text,
      if (mood != null) 'mood': mood,
      if (context != null) 'context': context,
    });
    return VyraAiResult.fromJson(res['data'] as Map<String, dynamic>);
  }

  Future<Map<String, dynamic>> morningBundle({String? mood}) async {
    final res = await _api.post('/ai/bundle', {if (mood != null) 'mood': mood});
    return res['data'] as Map<String, dynamic>;
  }

  Future<String> twin(String message, {String? mood}) async {
    final r = await invoke(capability: 'digital_twin', text: message, mood: mood);
    return r.output;
  }

  Future<VoiceNebulaResponseLite> voiceNebula(String transcript, {String? mood}) async {
    final res = await _api.post('/ai/voice-nebula', {
      'transcript': transcript,
      if (mood != null) 'mood': mood,
    });
    final data = res['data'] as Map<String, dynamic>;
    return VoiceNebulaResponseLite(
      reply: data['reply']?.toString() ?? '',
      replyForSpeech: data['replyForSpeech']?.toString() ?? '',
    );
  }
}

class VoiceNebulaResponseLite {
  VoiceNebulaResponseLite({required this.reply, required this.replyForSpeech});
  final String reply;
  final String replyForSpeech;
}
