import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

/// Live audio waveform — reacts to mic level or playback animation.
class LiveVoiceWaveform extends StatelessWidget {
  const LiveVoiceWaveform({
    super.key,
    required this.samples,
    required this.active,
    this.height = 72,
    this.barCount = 40,
  });

  final List<double> samples;
  final bool active;
  final double height;
  final int barCount;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      width: double.infinity,
      child: CustomPaint(
        painter: _WaveformPainter(
          samples: samples,
          active: active,
          barCount: barCount,
        ),
      ),
    );
  }
}

class _WaveformPainter extends CustomPainter {
  _WaveformPainter({
    required this.samples,
    required this.active,
    required this.barCount,
  });

  final List<double> samples;
  final bool active;
  final int barCount;

  @override
  void paint(Canvas canvas, Size size) {
    final barWidth = size.width / barCount;
    final gap = barWidth * 0.28;
    final w = barWidth - gap;

    for (var i = 0; i < barCount; i++) {
      final idx = samples.length - barCount + i;
      final level = idx >= 0 && idx < samples.length ? samples[idx].clamp(0.0, 1.0) : 0.05;
      final h = (level * size.height * 0.92).clamp(4.0, size.height);
      final x = i * barWidth + gap / 2;
      final y = (size.height - h) / 2;

      final t = i / barCount;
      final color = Color.lerp(AppColors.primary, AppColors.secondary, t)!;

      final paint = Paint()
        ..shader = LinearGradient(
          begin: Alignment.bottomCenter,
          end: Alignment.topCenter,
          colors: [
            color.withValues(alpha: active ? 0.5 : 0.2),
            AppColors.plasmaGold.withValues(alpha: active ? 0.95 : 0.35),
          ],
        ).createShader(Rect.fromLTWH(x, y, w, h));

      final r = RRect.fromRectAndRadius(
        Rect.fromLTWH(x, y, w, h),
        const Radius.circular(3),
      );
      canvas.drawRRect(r, paint);

      if (active && level > 0.35) {
        canvas.drawRRect(
          r,
          Paint()
            ..color = AppColors.secondary.withValues(alpha: 0.25)
            ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6),
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant _WaveformPainter old) =>
      old.active != active || old.samples != samples;
}

/// Generates smooth idle motion when mic is open but quiet.
double idleWaveSample(double t, int index) {
  return (0.12 + 0.08 * math.sin(t * 4 + index * 0.35)).clamp(0.0, 1.0);
}

/// Maps speech_to_text sound level (often negative dB) to 0–1.
double normalizeSoundLevel(double level) {
  if (level <= 0) {
    // Typical range roughly -2 .. -50 dB on mobile
    return ((level + 50) / 50).clamp(0.05, 1.0);
  }
  return level.clamp(0.05, 1.0);
}
