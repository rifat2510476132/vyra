import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:just_audio/just_audio.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

import 'api_service.dart';

final voiceNebulaServiceProvider = Provider<VoiceNebulaService>((ref) {
  return VoiceNebulaService(ref.watch(apiServiceProvider));
});

class VoiceNebulaTurn {
  VoiceNebulaTurn({
    required this.role,
    required this.text,
    this.audioBase64,
  });

  final String role; // user | nebula
  final String text;
  final String? audioBase64;
}

class VoiceNebulaResponse {
  VoiceNebulaResponse({
    required this.transcript,
    required this.reply,
    required this.replyForSpeech,
    this.audioBase64,
    this.energySignature,
    this.poweredBy,
  });

  final String transcript;
  final String reply;
  final String replyForSpeech;
  final String? audioBase64;
  final String? energySignature;
  final String? poweredBy;

  factory VoiceNebulaResponse.fromJson(Map<String, dynamic> json) {
    return VoiceNebulaResponse(
      transcript: json['transcript']?.toString() ?? '',
      reply: json['reply']?.toString() ?? '',
      replyForSpeech: json['replyForSpeech']?.toString() ?? json['reply']?.toString() ?? '',
      audioBase64: json['audioBase64']?.toString(),
      energySignature: json['energySignature']?.toString(),
      poweredBy: json['poweredBy']?.toString(),
    );
  }
}

class VoiceNebulaService {
  VoiceNebulaService(this._api);

  final ApiService _api;
  final stt.SpeechToText _stt = stt.SpeechToText();
  final FlutterTts _tts = FlutterTts();
  final AudioPlayer _player = AudioPlayer();

  bool _sttReady = false;
  bool _listening = false;
  bool _speaking = false;

  bool get isListening => _listening;
  bool get isSpeaking => _speaking;

  Future<bool> init() async {
    if (!kIsWeb) {
      final mic = await Permission.microphone.request();
      if (!mic.isGranted) return false;
    }
    _sttReady = await _stt.initialize();
    await _tts.setSpeechRate(0.48);
    await _tts.setPitch(1.05);
    await _tts.setVolume(1.0);
    if (!kIsWeb) {
      await _tts.awaitSpeakCompletion(true);
    }
    return _sttReady;
  }

  Future<void> startListening({
    required void Function(String partial) onPartial,
    required void Function(String finalText) onFinal,
    void Function(double level)? onSoundLevel,
  }) async {
    if (!_sttReady) {
      final ok = await init();
      if (!ok) throw Exception('Microphone or speech recognition unavailable');
    }
    if (_listening) return;

    _listening = true;
    await _stt.listen(
      onSoundLevelChange: onSoundLevel,
      onResult: (result) {
        final words = result.recognizedWords;
        if (result.finalResult) {
          _listening = false;
          onFinal(words);
        } else {
          onPartial(words);
        }
      },
      listenOptions: stt.SpeechListenOptions(
        listenMode: stt.ListenMode.confirmation,
        pauseFor: const Duration(seconds: 2),
        partialResults: true,
      ),
    );
  }

  Future<void> stopListening() async {
    if (_listening) {
      await _stt.stop();
      _listening = false;
    }
  }

  Future<VoiceNebulaResponse> converse(String transcript, {String? mood}) async {
    try {
      final res = await _api.post('/ai/voice-nebula', {
        'transcript': transcript,
        if (mood != null) 'mood': mood,
        'voice': 'nova',
      });
      return VoiceNebulaResponse.fromJson(res['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      final status = e.response?.statusCode;
      final data = e.response?.data;
      final serverMessage = data is Map<String, dynamic> ? data['message']?.toString() : null;
      throw Exception(
        serverMessage?.isNotEmpty == true
            ? 'Voice Nebula error ($status): $serverMessage'
            : 'Voice Nebula request failed with status $status',
      );
    }
  }

  Future<void> speak(VoiceNebulaResponse response) async {
    await _player.stop();
    _speaking = true;
    try {
      if (response.audioBase64 != null && response.audioBase64!.isNotEmpty) {
        try {
          final bytes = base64Decode(response.audioBase64!);
          final source = AudioSource.uri(
            Uri.dataFromBytes(bytes, mimeType: 'audio/mpeg'),
          );
          await _player.setAudioSource(source);
          await _player.play();
          await _player.processingStateStream
              .firstWhere((s) => s == ProcessingState.completed)
              .timeout(const Duration(minutes: 2));
          return;
        } catch (_) {
          // fall through to TTS
        }
      }
      await _tts.speak(response.replyForSpeech);
    } finally {
      _speaking = false;
    }
  }

  void dispose() {
    _player.dispose();
  }
}
