import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/app_colors.dart';

/// Floating holographic VYRA AI Twin orb (stable on web — no infinite animate).
class TwinOrb extends StatelessWidget {
  const TwinOrb({super.key});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      right: 16,
      bottom: 100,
      child: GestureDetector(
        onTap: () => context.push('/ai-hub'),
        child: Material(
          color: Colors.transparent,
          child: Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const RadialGradient(
                colors: [AppColors.secondary, AppColors.primary],
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.glow.withValues(alpha: 0.6),
                  blurRadius: 24,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: const Icon(Icons.auto_awesome, color: Colors.white),
          ),
        ),
      ),
    );
  }
}
