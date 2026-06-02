import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

/// Animated neural lattice for VYRA AI screens (2125).
class NeuralCorePainter extends CustomPainter {
  NeuralCorePainter({required this.t, required this.pulse});

  final double t;
  final double pulse;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height * 0.38);
    final paint = Paint()..style = PaintingStyle.stroke..strokeWidth = 1.2;

    for (var ring = 1; ring <= 4; ring++) {
      final r = 40.0 + ring * 35 + pulse * 12;
      paint.color = AppColors.secondary.withValues(alpha: 0.15 + ring * 0.05);
      canvas.drawCircle(center, r, paint);
    }

    const nodes = 12;
    for (var i = 0; i < nodes; i++) {
      final a = (i / nodes) * math.pi * 2 + t * math.pi * 2;
      final dist = 90 + math.sin(t * math.pi * 4 + i) * 25;
      final p = center + Offset(math.cos(a) * dist, math.sin(a) * dist);
      final nodePaint = Paint()
        ..color = Color.lerp(AppColors.primary, AppColors.plasmaGold, (i % 3) / 3)!
            .withValues(alpha: 0.7);
      canvas.drawCircle(p, 3 + pulse * 2, nodePaint);
      canvas.drawLine(center, p, paint..color = AppColors.glow.withValues(alpha: 0.2));
    }

    final core = Paint()
      ..shader = RadialGradient(
        colors: [
          AppColors.secondary.withValues(alpha: 0.9),
          AppColors.primary.withValues(alpha: 0.2),
          Colors.transparent,
        ],
      ).createShader(Rect.fromCircle(center: center, radius: 48));
    canvas.drawCircle(center, 48 + pulse * 8, core);
  }

  @override
  bool shouldRepaint(covariant NeuralCorePainter old) => old.t != t || old.pulse != pulse;
}
