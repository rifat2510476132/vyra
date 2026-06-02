import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive_flutter/hive_flutter.dart';

class StorageService {
  StorageService._();
  static final instance = StorageService._();

  final _secure = const FlutterSecureStorage();
  static const _accessKey = 'vyra_access_token';
  static const _refreshKey = 'vyra_refresh_token';
  static const _boxName = 'vyra_prefs';

  Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox(_boxName);
  }

  Box get _box => Hive.box(_boxName);

  Future<void> saveTokens({required String access, required String refresh}) async {
    await _secure.write(key: _accessKey, value: access);
    await _secure.write(key: _refreshKey, value: refresh);
  }

  Future<String?> getAccessToken() => _secure.read(key: _accessKey);
  Future<String?> getRefreshToken() => _secure.read(key: _refreshKey);

  Future<void> clearTokens() async {
    await _secure.delete(key: _accessKey);
    await _secure.delete(key: _refreshKey);
  }

  T? readPref<T>(String key) => _box.get(key) as T?;
  Future<void> writePref(String key, dynamic value) => _box.put(key, value);
}
