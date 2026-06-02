import 'package:flutter/material.dart';
import '../chat/chat_screen.dart';

/// Group real-time channel — reuses signal UI with collective context.
class GroupChatScreen extends StatelessWidget {
  const GroupChatScreen({super.key, required this.groupId, this.name = 'Collective'});

  final String groupId;
  final String name;

  @override
  Widget build(BuildContext context) {
    return ChatScreen(conversationId: groupId, title: name);
  }
}
