import 'dart:math';
import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class OrbitalNavItem {
  const OrbitalNavItem({required this.icon, required this.label});
  final IconData icon;
  final String label;
}

class OrbitalNav extends StatelessWidget {
  const OrbitalNav({
    super.key,
    required this.items,
    required this.selectedIndex,
    required this.onSelected,
  });

  final List<OrbitalNavItem> items;
  final int selectedIndex;
  final ValueChanged<int> onSelected;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 96,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(
            height: 72,
            margin: const EdgeInsets.symmetric(horizontal: 24),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(40),
              color: AppColors.surface.withValues(alpha: 0.85),
              border: Border.all(color: AppColors.primary.withValues(alpha: 0.5)),
              boxShadow: [
                BoxShadow(
                  color: AppColors.glow.withValues(alpha: 0.35),
                  blurRadius: 24,
                ),
              ],
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(items.length, (i) {
              final selected = i == selectedIndex;
              return GestureDetector(
                onTap: () => onSelected(i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 350),
                  curve: Curves.easeOutBack,
                  transform: Matrix4.identity()
                    ..translateByDouble(0.0, selected ? -10.0 : 0.0, 0, 1),
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: selected
                        ? const LinearGradient(
                            colors: [AppColors.primary, AppColors.secondary],
                          )
                        : null,
                    boxShadow: selected
                        ? [
                            BoxShadow(
                              color: AppColors.secondary.withValues(alpha: 0.5),
                              blurRadius: 16,
                            ),
                          ]
                        : null,
                  ),
                  child: Icon(
                    items[i].icon,
                    color: selected ? AppColors.text : AppColors.text.withValues(alpha: 0.5),
                    size: selected ? 26 : 22,
                  ),
                ),
              );
            }),
          ),
          Positioned(
            top: 0,
            child: Transform.rotate(
              angle: selectedIndex / max(items.length, 1) * pi * 2,
              child: Container(
                width: 12,
                height: 12,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.accent,
                  boxShadow: [
                    BoxShadow(color: AppColors.accent, blurRadius: 12, spreadRadius: 2),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
