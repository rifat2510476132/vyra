import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/animations/neural_core_painter.dart';
import '../../core/constants/app_colors.dart';
import '../../core/models/ai_capability.dart';
import '../../core/services/vyra_ai_service.dart';
import '../../core/widgets/glass_panel.dart';
import '../../core/widgets/neon_button.dart';

class AiStudioScreen extends ConsumerStatefulWidget {
  const AiStudioScreen({super.key, required this.capability});

  final AiCapability capability;

  @override
  ConsumerState<AiStudioScreen> createState() => _AiStudioScreenState();
}

class _AiStudioScreenState extends ConsumerState<AiStudioScreen>
    with SingleTickerProviderStateMixin {
  final _input = TextEditingController();
  late final AnimationController _anim;
  VyraAiResult? _result;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _anim = AnimationController(vsync: this, duration: const Duration(seconds: 12))..repeat();
  }

  @override
  void dispose() {
    _anim.dispose();
    _input.dispose();
    super.dispose();
  }

  Future<void> _run() async {
    setState(() => _loading = true);
    try {
      final r = await ref.read(vyraAiServiceProvider).invoke(
            capability: widget.capability.id,
            text: _input.text.trim().isEmpty ? 'Scan my social field.' : _input.text.trim(),
          );
      setState(() => _result = r);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c1 = Color(widget.capability.gradient[0]);
    final c2 = Color(widget.capability.gradient[1]);

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text('${widget.capability.icon} ${widget.capability.title}'),
      ),
      body: Stack(
        children: [
          AnimatedBuilder(
            animation: _anim,
            builder: (_, __) => CustomPaint(
              painter: NeuralCorePainter(t: _anim.value, pulse: _loading ? 1 : 0.3),
              size: Size.infinite,
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    widget.capability.category.toUpperCase(),
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(color: c2),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _input,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: _hintFor(widget.capability.id),
                      filled: true,
                    ),
                  ),
                  const SizedBox(height: 12),
                  NeonButton(
                    label: _loading ? 'Channeling…' : 'Invoke 2125 AI',
                    onPressed: _loading ? null : _run,
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: _result == null
                        ? Center(
                            child: Text(
                              'Neural channel open.\nTransmit a signal to begin.',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: AppColors.text.withValues(alpha: 0.6)),
                            ),
                          )
                        : GlassPanel(
                            child: SingleChildScrollView(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (_result!.energySignature != null)
                                    Text(
                                      'Signature: ${_result!.energySignature}',
                                      style: Theme.of(context).textTheme.labelSmall,
                                    ),
                                  const SizedBox(height: 8),
                                  Text(_result!.output),
                                  if (_result!.structured != null) ...[
                                    const SizedBox(height: 16),
                                    Text(
                                      'Structured lattice',
                                      style: Theme.of(context).textTheme.labelLarge?.copyWith(color: c1),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(_result!.structured.toString()),
                                  ],
                                  const SizedBox(height: 8),
                                  Text(
                                    'Powered by ${_result!.poweredBy ?? 'vyra'}',
                                    style: Theme.of(context).textTheme.bodySmall,
                                  ),
                                ],
                              ),
                            ),
                          ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.05),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _hintFor(String id) {
    const hints = {
      'digital_twin': 'Ask your twin anything…',
      'emotion_signature': 'Paste post text to fingerprint emotion…',
      'dream_forge': 'Describe your goal in natural language…',
      'vibe_match': 'Describe someone you might resonate with…',
      'neural_bookmark': 'Paste content to store in long-term memory…',
    };
    return hints[id] ?? 'Enter signal for ${widget.capability.title}…';
  }
}
