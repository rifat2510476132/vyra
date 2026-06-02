import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/api_service.dart';
import '../../core/widgets/particle_background.dart';

/// Living node graph of social connections (2125 relationship lattice).
class RelationshipMapScreen extends ConsumerStatefulWidget {
  const RelationshipMapScreen({super.key});

  @override
  ConsumerState<RelationshipMapScreen> createState() => _RelationshipMapScreenState();
}

class _RelationshipMapScreenState extends ConsumerState<RelationshipMapScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulse;
  int _friendCount = 0;

  @override
  void initState() {
    super.initState();
    _pulse = AnimationController(vsync: this, duration: const Duration(seconds: 3))
      ..repeat(reverse: true);
    _loadFriends();
  }

  Future<void> _loadFriends() async {
    try {
      final res = await ref.read(apiServiceProvider).get('/friends');
      final list = (res['data'] as List?) ?? [];
      setState(() => _friendCount = list.length);
    } catch (_) {}
  }

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Relationship Lattice ($_friendCount bonds)')),
      body: ParticleBackground(
        child: AnimatedBuilder(
          animation: _pulse,
          builder: (_, __) => CustomPaint(
            painter: _LatticePainter(_pulse.value),
            size: Size.infinite,
          ),
        ),
      ),
    );
  }
}

class _LatticePainter extends CustomPainter {
  _LatticePainter(this.t);
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final nodes = List.generate(8, (i) {
      final a = i * math.pi / 4 + t * math.pi;
      final r = size.shortestSide * 0.28 + math.sin(t * math.pi * 2 + i) * 12;
      return center + Offset(math.cos(a) * r, math.sin(a) * r);
    });

    final edge = Paint()
      ..color = AppColors.auroraCyan.withValues(alpha: 0.35)
      ..strokeWidth = 1.2;
    for (var i = 0; i < nodes.length; i++) {
      canvas.drawLine(center, nodes[i], edge);
      canvas.drawLine(nodes[i], nodes[(i + 1) % nodes.length], edge);
    }

    final nodePaint = Paint()..color = AppColors.quantumViolet;
    for (final n in nodes) {
      canvas.drawCircle(n, 10 + t * 4, nodePaint);
    }
    canvas.drawCircle(center, 14, Paint()..color = AppColors.plasmaGold);
  }

  @override
  bool shouldRepaint(covariant _LatticePainter old) => old.t != t;
}
