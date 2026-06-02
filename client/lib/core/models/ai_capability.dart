class AiCapability {
  const AiCapability({
    required this.id,
    required this.title,
    required this.category,
    required this.icon,
    required this.gradient,
  });

  final String id;
  final String title;
  final String category;
  final String icon;
  final List<int> gradient;

  factory AiCapability.fromJson(Map<String, dynamic> json) {
    return AiCapability(
      id: json['id'] as String,
      title: json['title'] as String,
      category: json['category'] as String? ?? 'Studio',
      icon: _iconFor(json['id'] as String),
      gradient: _gradientFor(json['category'] as String? ?? ''),
    );
  }

  static String _iconFor(String id) {
    const map = {
      'digital_twin': '✦',
      'neural_bookmark': '◈',
      'emotion_signature': '◎',
      'temporal_echo': '⟳',
      'vibe_match': '∞',
      'intent_engine': '⬡',
      'reputation_lattice': '▣',
      'mood_oracle': '☽',
      'twin_digest': '◉',
      'dream_forge': '✧',
      'memory_weaver': '✴',
      'trend_prophet': '↑',
    };
    return map[id] ?? '◇';
  }

  static List<int> _gradientFor(String category) {
    switch (category) {
      case 'Consciousness':
        return [0xFF7B2FBE, 0xFF00D4FF];
      case 'Memory':
        return [0xFF9B59B6, 0xFF7B2FBE];
      case 'Oracle':
        return [0xFF00D4FF, 0xFFFFD700];
      case 'Shield':
        return [0xFFFF6B6B, 0xFF7B2FBE];
      default:
        return [0xFF7B2FBE, 0xFFFFD700];
    }
  }
}
