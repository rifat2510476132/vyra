import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

const vyraMoods = ['ENERGIZED', 'CALM', 'CREATIVE', 'FOCUSED', 'SOCIAL'];

class MoodSelector extends StatelessWidget {
  const MoodSelector({super.key, required this.selected, required this.onSelected});

  final String selected;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: vyraMoods.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (_, i) {
          final mood = vyraMoods[i];
          final active = mood == selected;
          return FilterChip(
            label: Text(mood, style: const TextStyle(fontSize: 11)),
            selected: active,
            onSelected: (_) => onSelected(mood),
            selectedColor: AppColors.primary.withValues(alpha: 0.5),
            backgroundColor: AppColors.surface.withValues(alpha: 0.6),
            side: BorderSide(
              color: active ? AppColors.secondary : Colors.transparent,
            ),
          );
        },
      ),
    );
  }
}
