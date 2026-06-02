import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

/// Slow breathing gradient — 2125 ambient motion.
class BreathingBackground extends StatefulWidget {
  const BreathingBackground({super.key, required this.child});
  final Widget child;

  @override
  State<BreathingBackground> createState() => _BreathingBackgroundState();
}

class _BreathingBackgroundState extends State<BreathingBackground>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(seconds: 8))
      ..repeat(reverse: true);
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _c,
      builder: (_, __) {
        final t = _c.value;
        return Container(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              center: Alignment(0.2 + t * 0.1, -0.4),
              radius: 1.2,
              colors: [
                AppColors.primary.withValues(alpha: 0.25 + t * 0.1),
                AppColors.background,
                AppColors.surface,
              ],
            ),
          ),
          child: widget.child,
        );
      },
    );
  }
}
