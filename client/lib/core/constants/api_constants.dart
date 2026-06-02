abstract final class ApiConstants {
  static const baseUrl = String.fromEnvironment(
    'VYRA_API_URL',
    defaultValue: 'http://localhost:5000/api/v1',
  );

  static const socketUrl = String.fromEnvironment(
    'VYRA_SOCKET_URL',
    defaultValue: 'http://localhost:5000',
  );
}
