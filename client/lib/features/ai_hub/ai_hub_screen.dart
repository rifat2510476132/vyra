import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/animations/breathing_background.dart';
import '../../core/animations/neural_core_painter.dart';
import '../../core/constants/app_colors.dart';
import '../../core/models/ai_capability.dart';
import '../../core/services/vyra_ai_service.dart';
import '../../core/widgets/glass_panel.dart';
import 'package:go_router/go_router.dart';
import 'ai_studio_screen.dart';

final aiManifestProvider = FutureProvider<List<AiCapability>>((ref) async {
  try {
    return await ref.watch(vyraAiServiceProvider).manifest();
  } catch (_) {
    return const [];
  }
});

class AiHubScreen extends ConsumerStatefulWidget {
  const AiHubScreen({super.key, this.embedded = false});

  /// When true, rendered inside [HomeShell] without nested Scaffold.
  final bool embedded;

  @override
  ConsumerState<AiHubScreen> createState() => _AiHubScreenState();
}

class _AiHubScreenState extends ConsumerState<AiHubScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _anim;
  final _twinInput = TextEditingController();
  String _twinReply = '';
  bool _twinLoading = false;

  @override
  void initState() {
    super.initState();
    _anim = AnimationController(vsync: this, duration: const Duration(seconds: 14))..repeat();
    _loadBundle();
  }

  Future<void> _loadBundle() async {
    try {
      final bundle = await ref.read(vyraAiServiceProvider).morningBundle();
      final digest = bundle['digest'] as Map<String, dynamic>?;
      if (digest != null && mounted) {
        setState(() => _twinReply = digest['output']?.toString() ?? '');
      }
    } catch (_) {
      if (mounted && _twinReply.isEmpty) {
        setState(() => _twinReply = 'AI digest will appear when backend is ready.');
      }
    }
  }

  Future<void> _askTwin() async {
    setState(() => _twinLoading = true);
    try {
      final reply = await ref.read(vyraAiServiceProvider).twin(_twinInput.text);
      setState(() => _twinReply = reply);
    } catch (e) {
      if (mounted) {
        setState(() => _twinReply = 'Twin is warming up. Try again.\n$e');
      }
    } finally {
      if (mounted) setState(() => _twinLoading = false);
    }
  }

  @override
  void dispose() {
    _anim.dispose();
    _twinInput.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final manifest = ref.watch(aiManifestProvider);

    final body = Stack(
      children: [
        AnimatedBuilder(
          animation: _anim,
          builder: (_, __) => CustomPaint(
            painter: NeuralCorePainter(t: _anim.value, pulse: 0.5),
            size: Size.infinite,
          ),
        ),
        SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'VYRA Neural Hub',
                        style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 28),
                      ),
                      Text(
                        '2125 cognition layer · anti-repetition active',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.secondary,
                            ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => context.push('/voice-nebula'),
                      borderRadius: BorderRadius.circular(20),
                      child: Ink(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          gradient: LinearGradient(
                            colors: [
                              AppColors.secondary.withValues(alpha: 0.35),
                              AppColors.primary.withValues(alpha: 0.5),
                            ],
                          ),
                          border: Border.all(color: AppColors.plasmaGold.withValues(alpha: 0.5)),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              const Text('🌌', style: TextStyle(fontSize: 32)),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Voice Nebula',
                                      style: Theme.of(context).textTheme.titleLarge,
                                    ),
                                    Text(
                                      'Hold to speak · AI answers with voice',
                                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                            color: AppColors.secondary,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(Icons.arrow_forward_ios, size: 16),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: GlassPanel(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Text('✦', style: TextStyle(fontSize: 28)),
                            const SizedBox(width: 8),
                            Text('Digital Twin', style: Theme.of(context).textTheme.titleLarge),
                          ],
                        ),
                        if (_twinReply.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Text(_twinReply, maxLines: 4, overflow: TextOverflow.ellipsis),
                        ],
                        const SizedBox(height: 8),
                        TextField(
                          controller: _twinInput,
                          decoration: const InputDecoration(hintText: 'Speak to your twin…'),
                        ),
                        const SizedBox(height: 8),
                        FilledButton(
                          onPressed: _twinLoading ? null : _askTwin,
                          child: Text(_twinLoading ? 'Thinking…' : 'Transmit'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              manifest.when(
                data: (caps) => caps.isEmpty
                    ? const SliverToBoxAdapter(
                        child: Padding(
                          padding: EdgeInsets.fromLTRB(20, 12, 20, 100),
                          child: GlassPanel(
                            child: Text('AI capabilities are loading. Please try again shortly.'),
                          ),
                        ),
                      )
                    : SliverPadding(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                        sliver: SliverGrid(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisSpacing: 12,
                            crossAxisSpacing: 12,
                            childAspectRatio: 1.05,
                          ),
                          delegate: SliverChildBuilderDelegate(
                            (context, i) {
                              final cap = caps[i];
                              return _CapabilityCard(
                                capability: cap,
                                onTap: () => Navigator.of(context).push(
                                  MaterialPageRoute<void>(
                                    builder: (_) => AiStudioScreen(capability: cap),
                                  ),
                                ),
                              );
                            },
                            childCount: caps.length,
                          ),
                        ),
                      ),
                loading: () => const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator()),
                ),
                error: (e, _) => SliverFillRemaining(
                  child: Center(child: Text('Hub offline — start server\n$e')),
                ),
              ),
            ],
          ),
        ),
      ],
    );

    if (widget.embedded) return body;

    return Scaffold(
      body: BreathingBackground(child: body),
    );
  }
}

class _CapabilityCard extends StatelessWidget {
  const _CapabilityCard({required this.capability, required this.onTap});

  final AiCapability capability;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final c1 = Color(capability.gradient[0]);
    final c2 = Color(capability.gradient[1]);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Ink(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: LinearGradient(
              colors: [c1.withValues(alpha: 0.45), c2.withValues(alpha: 0.25)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            border: Border.all(color: AppColors.secondary.withValues(alpha: 0.35)),
            boxShadow: [
              BoxShadow(color: c1.withValues(alpha: 0.25), blurRadius: 16, spreadRadius: 0),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(capability.icon, style: const TextStyle(fontSize: 26)),
                const Spacer(),
                Text(
                  capability.title,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                ),
                Text(
                  capability.category,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.text.withValues(alpha: 0.7),
                      ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
