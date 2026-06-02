import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api_service.dart';

final vyraApiProvider = Provider<VyraApi>((ref) => VyraApi(ref.watch(apiServiceProvider)));

class VyraApi {
  VyraApi(this._api);
  final ApiService _api;

  Future<List<dynamic>> homeFeed({String? mood}) async {
    final r = await _api.get('/feed/home', query: mood != null ? {'mood': mood} : null);
    final data = r['data'] as Map<String, dynamic>?;
    final posts = (data?['posts'] as List?) ?? [];
    if (posts.isNotEmpty) return posts;
    final fallback = await _api.get('/feed', query: {'page': '0', 'limit': '20'});
    return (fallback['data'] as List?) ?? [];
  }

  Future<List<dynamic>> galaxies() =>
      _api.get('/galaxies').then((r) => (r['data'] as List?) ?? []);

  Future<Map<String, dynamic>> socialEnergy() =>
      _api.get('/social-energy').then((r) => r['data'] as Map<String, dynamic>);

  Future<List<dynamic>> dreamBoards() =>
      _api.get('/dream-boards').then((r) => (r['data'] as List?) ?? []);

  Future<List<dynamic>> memories() =>
      _api.get('/memory-universe').then((r) => (r['data'] as List?) ?? []);

  Future<Map<String, dynamic>> aiTwin(String message) => _api
      .post('/ai/twin', {'message': message})
      .then((r) => r['data'] as Map<String, dynamic>);

  Future<void> setMood(String mood) => _api.patch('/users/mood', {'mood': mood});
}
