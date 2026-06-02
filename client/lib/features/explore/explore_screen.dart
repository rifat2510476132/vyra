import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_colors.dart';
import '../../core/services/vyra_api.dart';
import 'interest_galaxy_painter.dart';

class ExploreScreen extends ConsumerStatefulWidget {
  const ExploreScreen({super.key});

  @override
  ConsumerState<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends ConsumerState<ExploreScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  List<dynamic> _galaxies = const [];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 30),
    )..repeat();
    _loadGalaxies();
  }

  Future<void> _loadGalaxies() async {
    try {
      final g = await ref.read(vyraApiProvider).galaxies();
      if (mounted) setState(() => _galaxies = g);
    } catch (_) {
      if (mounted) setState(() => _galaxies = const []);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              'Interest Galaxy',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ),
          Expanded(
            child: AnimatedBuilder(
              animation: _controller,
              builder: (_, __) => CustomPaint(
                painter: InterestGalaxyPainter(animation: _controller.value),
                size: Size.infinite,
              ),
            ),
          ),
          if (_galaxies.isNotEmpty)
            SizedBox(
              height: 72,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _galaxies.length,
                itemBuilder: (_, i) {
                  final g = _galaxies[i] as Map<String, dynamic>;
                  return Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: Chip(
                      label: Text('${g['name']} (${g['category']})'),
                      backgroundColor: AppColors.primary.withValues(alpha: 0.35),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}
