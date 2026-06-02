import 'dart:math';
import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class ParticleBackground extends StatefulWidget {
  const ParticleBackground({super.key, required this.child});
  final Widget child;

  @override
  State<ParticleBackground> createState() => _ParticleBackgroundState();
}

class _ParticleBackgroundState extends State<ParticleBackground>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  final _random = Random();
  late List<_Particle> _particles;

  @override
  void initState() {
    super.initState();
    _particles = List.generate(40, (_) => _Particle.random(_random));
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 20),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        AnimatedBuilder(
          animation: _controller,
          builder: (context, _) {
            return CustomPaint(
              painter: _ParticlePainter(
                particles: _particles,
                progress: _controller.value,
              ),
            );
          },
        ),
        widget.child,
      ],
    );
  }
}

class _Particle {
  _Particle(this.x, this.y, this.size, this.speed, this.color);
  final double x;
  final double y;
  final double size;
  final double speed;
  final Color color;

  factory _Particle.random(Random r) {
    final colors = [AppColors.primary, AppColors.secondary, AppColors.glow];
    return _Particle(
      r.nextDouble(),
      r.nextDouble(),
      r.nextDouble() * 2 + 0.5,
      r.nextDouble() * 0.3 + 0.05,
      colors[r.nextInt(colors.length)],
    );
  }
}

class _ParticlePainter extends CustomPainter {
  _ParticlePainter({required this.particles, required this.progress});
  final List<_Particle> particles;
  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    final bg = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          AppColors.background,
          Color.lerp(AppColors.background, AppColors.primary, 0.15 + sin(progress * pi) * 0.05)!,
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Offset.zero & size, bg);

    for (final p in particles) {
      final dy = (p.y + progress * p.speed) % 1.0;
      final paint = Paint()
        ..color = p.color.withValues(alpha: 0.5)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);
      canvas.drawCircle(
        Offset(p.x * size.width, dy * size.height),
        p.size,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _ParticlePainter oldDelegate) =>
      oldDelegate.progress != progress;
}
