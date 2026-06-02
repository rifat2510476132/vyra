import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../constants/api_constants.dart';
import 'storage_service.dart';

final socketServiceProvider = Provider<SocketService>((ref) => SocketService());

class SocketService {
  io.Socket? _socket;

  Future<void> connect() async {
    final token = await StorageService.instance.getAccessToken();
    if (token == null) return;

    _socket?.dispose();
    _socket = io.io(
      ApiConstants.socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .enableAutoConnect()
          .build(),
    );
  }

  void joinConversation(String id) => _socket?.emit('chat:join', id);

  void sendMessage({
    required String conversationId,
    String? content,
    String? mediaUrl,
    String? replyToId,
  }) {
    _socket?.emit('chat:message', {
      'conversationId': conversationId,
      'content': content,
      'mediaUrl': mediaUrl,
      'replyToId': replyToId,
    });
  }

  void onMessage(void Function(dynamic) handler) {
    _socket?.on('chat:message', handler);
  }

  void onNotification(void Function(dynamic) handler) {
    _socket?.on('notification:new', handler);
  }

  void onRead(void Function(dynamic) handler) {
    _socket?.on('chat:read', handler);
  }

  void startTyping(String conversationId) {
    _socket?.emit('typing:start', conversationId);
  }

  void stopTyping(String conversationId) {
    _socket?.emit('typing:stop', conversationId);
  }

  void onTypingStart(void Function(dynamic) handler) {
    _socket?.on('typing:start', handler);
  }

  void onTypingStop(void Function(dynamic) handler) {
    _socket?.on('typing:stop', handler);
  }

  void editMessage({
    required String messageId,
    required String content,
  }) {
    _socket?.emit('chat:edit', {
      'messageId': messageId,
      'content': content,
    });
  }

  void deleteMessage({
    required String messageId,
  }) {
    _socket?.emit('chat:delete', {
      'messageId': messageId,
    });
  }

  void onMessageEdited(void Function(dynamic) handler) {
    _socket?.on('chat:edited', handler);
  }

  void onMessageDeleted(void Function(dynamic) handler) {
    _socket?.on('chat:deleted', handler);
  }

  void reactMessage({
    required String messageId,
    required String reactionType,
  }) {
    _socket?.emit('chat:react', {
      'messageId': messageId,
      'reactionType': reactionType,
    });
  }

  void onMessageReaction(void Function(dynamic) handler) {
    _socket?.on('chat:reaction', handler);
  }

  void updatePresence(String presence) {
    _socket?.emit('presence:update', presence);
  }

  void onPresenceChanged(void Function(dynamic) handler) {
    _socket?.on('presence:changed', handler);
  }

  void dispose() => _socket?.dispose();
}
