import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/api_constants.dart';
import 'storage_service.dart';

final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

class ApiService {
  ApiService() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await StorageService.instance.getAccessToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (err, handler) async {
          if (err.response?.statusCode != 401) {
            handler.next(err);
            return;
          }
          final request = err.requestOptions;
          final alreadyRetried = request.extra['retried'] == true;
          if (alreadyRetried) {
            await StorageService.instance.clearTokens();
            handler.next(err);
            return;
          }
          final refreshed = await _refreshAccessToken();
          if (!refreshed) {
            await StorageService.instance.clearTokens();
            handler.next(err);
            return;
          }
          final access = await StorageService.instance.getAccessToken();
          final retry = await _dio.fetch<Map<String, dynamic>>(
            request.copyWith(
              headers: {
                ...request.headers,
                if (access != null) 'Authorization': 'Bearer $access',
              },
              extra: {...request.extra, 'retried': true},
            ),
          );
          handler.resolve(retry);
        },
      ),
    );
  }

  late final Dio _dio = Dio(
    BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  Future<bool> _refreshAccessToken() async {
    try {
      final refresh = await StorageService.instance.getRefreshToken();
      if (refresh == null || refresh.isEmpty) return false;
      final res = await _dio.post<Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refreshToken': refresh},
      );
      final body = res.data ?? <String, dynamic>{};
      final data = body['data'] as Map<String, dynamic>?;
      final access = data?['accessToken']?.toString();
      if (access == null || access.isEmpty) return false;
      await StorageService.instance.saveTokens(access: access, refresh: refresh);
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body) async {
    final res = await _dio.post(path, data: body);
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> get(String path, {Map<String, dynamic>? query}) async {
    final res = await _dio.get(path, queryParameters: query);
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> patch(String path, Map<String, dynamic> body) async {
    final res = await _dio.patch(path, data: body);
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> delete(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final res = await _dio.delete(path, data: body);
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> postMultipart(String path, FormData form) async {
    final res = await _dio.post(
      path,
      data: form,
      options: Options(contentType: 'multipart/form-data'),
    );
    return res.data as Map<String, dynamic>;
  }
}
