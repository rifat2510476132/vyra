import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/animations/neural_core_painter.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/voice_nebula_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/live_voice_waveform.dart';

class VoiceNebulaScreen extends ConsumerStatefulWidget {
  const VoiceNebulaScreen({super.key});

  @override
  ConsumerState<VoiceNebulaScreen> createState() => _VoiceNebulaScreenState();
}

class _VoiceNebulaScreenState extends ConsumerState<VoiceNebulaScreen>
    with TickerProviderStateMixin {
  late final AnimationController _pulse;
  late final AnimationController _waveTick;
  VoiceNebulaService? _voice;
  bool _booted = false;

  final List<VoiceNebulaTurn> _turns = [];
  final List<double> _waveSamples = [];
  final TextEditingController _textInput = TextEditingController();
  String _partial = '';
  bool _ready = false;
  bool _processing = false;
  String _status = 'Initializing nebula channel…';

  static const _waveCapacity = 48;

  @override
  void initState() {
    super.initState();
    _pulse = AnimationController(vsync: this, duration: const Duration(milliseconds: 1800))
      ..repeat(reverse: true);
    _waveTick = AnimationController(vsync: this, duration: const Duration(milliseconds: 50))
      ..addListener(_onWaveTick);
  }

  void _onWaveTick() {
    if (!mounted) return;
    final voice = _voice;
    if (voice == null) return;
    if (!voice.isListening && !voice.isSpeaking && !_processing) return;
    if (voice.isListening) return;
    if (voice.isSpeaking || _processing) {
      _pushWave(idleWaveSample(_waveTick.value * 20, _waveSamples.length));
      setState(() {});
    }
  }

  void _pushWave(double level) {
    _waveSamples.add(level);
    while (_waveSamples.length > _waveCapacity) {
      _waveSamples.removeAt(0);
    }
  }

  void _ensureService() {
    if (_booted) return;
    _booted = true;
    _voice = ref.read(voiceNebulaServiceProvider);
    _boot();
  }

  Future<void> _boot() async {
    final ok = await _voice!.init();
    if (!mounted) return;
    setState(() {
      _ready = ok;
      _status = ok
          ? 'Hold the orb and speak — live waveform active'
          : 'Microphone permission required for Voice Nebula.';
    });
  }

  Future<void> _onMicDown() async {
    if (!_ready || _processing) return;
    _waveSamples.clear();
    _waveTick.repeat();
    setState(() {
      _partial = '';
      _status = 'Listening…';
    });
    try {
      await _voice!.startListening(
        onPartial: (p) => setState(() => _partial = p),
        onFinal: (text) => _handleUtterance(text),
        onSoundLevel: (level) {
          if (!mounted) return;
          _pushWave(normalizeSoundLevel(level));
          setState(() {});
        },
      );
    } catch (e) {
      _waveTick.stop();
      if (!mounted) return;
      setState(() => _status = 'Mic error: $e');
    }
  }

  Future<void> _onMicUp() async {
    _waveTick.stop();
    await _voice!.stopListening();
    if (_partial.isNotEmpty && !_processing) {
      await _handleUtterance(_partial);
    }
  }

  Future<void> _handleUtterance(String text) async {
    final utterance = text.trim();
    if (utterance.isEmpty) {
      setState(() => _status = 'No signal detected. Try again.');
      return;
    }

    setState(() {
      _processing = true;
      _status = 'VYRA is weaving a voice response…';
      _turns.add(VoiceNebulaTurn(role: 'user', text: utterance));
      _partial = '';
    });
    _waveTick.repeat();

    try {
      final res = await _voice!.converse(utterance);
      if (!mounted) return;
      setState(() {
        _turns.add(VoiceNebulaTurn(
          role: 'nebula',
          text: res.reply,
          audioBase64: res.audioBase64,
        ));
        _status = res.energySignature != null
            ? 'Signature ${res.energySignature}'
            : 'Nebula speaking…';
      });
      await _voice!.speak(res);
      if (mounted) {
        setState(() => _textInput.clear());
      }
    } catch (e) {
      if (mounted) {
        setState(() => _status = 'Channel error: $e');
      }
    } finally {
      _waveTick.stop();
      if (mounted) setState(() => _processing = false);
    }
  }

  @override
  void dispose() {
    _waveTick.dispose();
    _pulse.dispose();
    _textInput.dispose();
    _voice?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    _ensureService();
    final voice = _voice!;
    final waveActive = voice.isListening || voice.isSpeaking || _processing;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: const Text('Voice Nebula'),
      ),
      body: Stack(
        children: [
          AnimatedBuilder(
            animation: _pulse,
            builder: (_, __) => CustomPaint(
              painter: NeuralCorePainter(
                t: _pulse.value,
                pulse: voice.isListening ? 1.0 : 0.35,
              ),
              size: Size.infinite,
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                  child: Text(
                    _status,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.secondary,
                        ),
                    textAlign: TextAlign.center,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                  child: GlassPanel(
                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                    child: LiveVoiceWaveform(
                      samples: _waveSamples.isEmpty && waveActive
                          ? List.generate(
                              _waveCapacity,
                              (i) => idleWaveSample(_pulse.value * math.pi * 2, i),
                            )
                          : _waveSamples,
                      active: waveActive,
                      height: 80,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _textInput,
                          minLines: 1,
                          maxLines: 2,
                          enabled: !_processing,
                          decoration: const InputDecoration(
                            hintText: 'Type if mic is unavailable...',
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      FilledButton(
                        onPressed: _processing
                            ? null
                            : () => _handleUtterance(_textInput.text),
                        child: const Text('Send'),
                      ),
                    ],
                  ),
                ),
                if (_partial.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.all(12),
                    child: Text(
                      '“$_partial”',
                      style: TextStyle(
                        color: AppColors.text.withValues(alpha: 0.7),
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _turns.length,
                    itemBuilder: (_, i) {
                      final t = _turns[i];
                      final isUser = t.role == 'user';
                      return Align(
                        alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 10),
                          constraints: BoxConstraints(
                            maxWidth: MediaQuery.sizeOf(context).width * 0.82,
                          ),
                          child: GlassPanel(
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  isUser ? 'You' : 'Nebula',
                                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                        color: isUser ? AppColors.secondary : AppColors.plasmaGold,
                                      ),
                                ),
                                const SizedBox(height: 4),
                                Text(t.text),
                              ],
                            ),
                          ),
                        ),
                      ).animate().fadeIn(duration: 300.ms);
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 8, 24, 32),
                  child: Column(
                    children: [
                      Text(
                        voice.isListening ? 'Release to send' : 'Hold to speak',
                        style: Theme.of(context).textTheme.labelLarge,
                      ),
                      const SizedBox(height: 16),
                      GestureDetector(
                        onLongPressStart: (_) => _onMicDown(),
                        onLongPressEnd: (_) => _onMicUp(),
                        onTap: _ready && !_processing ? () => _onMicDown() : null,
                        child: Container(
                          width: 96,
                          height: 96,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: RadialGradient(
                              colors: [
                                AppColors.secondary.withValues(
                                  alpha: voice.isListening ? 1 : 0.7,
                                ),
                                AppColors.primary,
                              ],
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.glow.withValues(
                                  alpha: voice.isListening ? 0.8 : 0.35,
                                ),
                                blurRadius: voice.isListening ? 40 : 20,
                                spreadRadius: voice.isListening ? 4 : 0,
                              ),
                            ],
                          ),
                          child: Icon(
                            _processing
                                ? Icons.hourglass_top
                                : voice.isListening
                                    ? Icons.graphic_eq
                                    : Icons.mic,
                            size: 40,
                            color: Colors.white,
                          ),
                        ),
                      )
                          .animate(
                            target: voice.isListening ? 1 : 0,
                          )
                          .scale(
                            begin: const Offset(1, 1),
                            end: const Offset(1.12, 1.12),
                            duration: 600.ms,
                          ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
