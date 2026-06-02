import 'dart:math';
import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class InterestGalaxyPainter extends CustomPainter {
  InterestGalaxyPainter({required this.animation});
  final double animation;

  static const clusters = [
    ('Tech', AppColors.secondary),
    ('Art', AppColors.accent),
    ('Music', AppColors.glow),
    ('Science', AppColors.primary),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    for (var i = 0; i < clusters.length; i++) {
      final angle = (i / clusters.length) * 2 * pi + animation * 2 * pi;
      final radius = size.shortestSide * 0.28;
      final cx = center.dx + cos(angle) * radius;
      final cy = center.dy + sin(angle) * radius;
      final clusterCenter = Offset(cx, cy);

      final glow = Paint()
        ..color = clusters[i].$2.withValues(alpha: 0.25)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 24);
      canvas.drawCircle(clusterCenter, 36 + sin(animation * pi + i) * 6, glow);

      final starPaint = Paint()..color = clusters[i].$2;
      for (var s = 0; s < 12; s++) {
        final sa = s / 12 * 2 * pi + animation;
        final sr = 18 + s % 3 * 4.0;
        canvas.drawCircle(
          clusterCenter + Offset(cos(sa) * sr, sin(sa) * sr),
          2 + s % 2,
          starPaint,
        );
      }

      final textPainter = TextPainter(
        text: TextSpan(
          text: clusters[i].$1,
          style: const TextStyle(color: AppColors.text, fontSize: 11),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      textPainter.paint(
        canvas,
        clusterCenter - Offset(textPainter.width / 2, -28),
      );
    }

    final core = Paint()
      ..shader = RadialGradient(
        colors: [AppColors.primary, Colors.transparent],
      ).createShader(Rect.fromCircle(center: center, radius: 40));
    canvas.drawCircle(center, 30 + sin(animation * pi) * 4, core);
  }

  @override
  bool shouldRepaint(covariant InterestGalaxyPainter old) =>
      old.animation != animation;
}
