import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/services/api_service.dart';
import '../../core/services/media_upload_service.dart';
import '../../core/services/socket_service.dart';
import '../../core/services/vyra_ai_service.dart';
import '../../core/widgets/glass_panel.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key, required this.conversationId, this.title = 'Signal Link'});

  final String conversationId;
  final String title;

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _input = TextEditingController();
  final _scroll = ScrollController();
  final _messages = <Map<String, dynamic>>[];
  final _picker = ImagePicker();
  String? _myUserId;
  bool _aiBusy = false;
  bool _typing = false;
  String? _typingUserId;
  DateTime? _lastReadAt;
  bool _disposed = false;
  String? _peerUserId;
  bool _peerOnline = false;
  Map<String, dynamic>? _replyTo;

  @override
  void initState() {
    super.initState();
    _input.addListener(_onInputChanged);
    WidgetsBinding.instance.addPostFrameCallback((_) => _init());
  }

  void _onInputChanged() {
    final socket = ref.read(socketServiceProvider);
    final hasText = _input.text.trim().isNotEmpty;
    if (hasText && !_typing) {
      _typing = true;
      socket.startTyping(widget.conversationId);
    } else if (!hasText && _typing) {
      _typing = false;
      socket.stopTyping(widget.conversationId);
    }
  }

  Future<void> _init() async {
    final api = ref.read(apiServiceProvider);
    try {
      final me = await api.get('/auth/me');
      final user = (me['data'] as Map?)?['user'] as Map?;
      _myUserId = user?['id']?.toString();
    } catch (_) {}

    try {
      final convRes = await api.get('/conversations');
      final items = (convRes['data'] as List?) ?? [];
      for (final item in items) {
        final conv = (item as Map)['conversation'] as Map?;
        if (conv?['id']?.toString() == widget.conversationId) {
          final members = conv?['members'] as List? ?? [];
          for (final m in members) {
            final uid = (m as Map)['userId']?.toString();
            if (uid != null && uid != _myUserId) {
              _peerUserId = uid;
              break;
            }
          }
          break;
        }
      }
    } catch (_) {}

    try {
      final hist = await api.get('/conversations/${widget.conversationId}/messages');
      final list = (hist['data'] as List?) ?? [];
      if (mounted) {
        setState(() => _messages.addAll(list.cast<Map<String, dynamic>>()));
      }
    } catch (_) {}

    try {
      await api.patch('/conversations/${widget.conversationId}/read', {});
    } catch (_) {}

    final socket = ref.read(socketServiceProvider);
    await socket.connect();
    socket.joinConversation(widget.conversationId);
    socket.updatePresence('ONLINE');
    socket.onMessage((data) {
      if (_disposed) return;
      if (data is Map && data['conversationId']?.toString() == widget.conversationId) {
        setState(() => _messages.add(Map<String, dynamic>.from(data)));
        _scrollToBottom();
      }
    });
    socket.onRead((payload) {
      if (_disposed) return;
      if (payload is Map && payload['conversationId']?.toString() == widget.conversationId) {
        final readAt = payload['readAt']?.toString();
        setState(() => _lastReadAt = readAt != null ? DateTime.tryParse(readAt) : null);
      }
    });
    socket.onTypingStart((payload) {
      if (_disposed) return;
      if (payload is Map && payload['conversationId']?.toString() == widget.conversationId) {
        final userId = payload['userId']?.toString();
        if (userId != null && userId != _myUserId) {
          setState(() => _typingUserId = userId);
        }
      }
    });
    socket.onTypingStop((payload) {
      if (_disposed) return;
      if (payload is Map && payload['conversationId']?.toString() == widget.conversationId) {
        setState(() => _typingUserId = null);
      }
    });
    socket.onMessageEdited((payload) {
      if (_disposed) return;
      if (payload is! Map) return;
      final edited = Map<String, dynamic>.from(payload);
      final id = edited['id']?.toString();
      if (id == null) return;
      final idx = _messages.indexWhere((m) => m['id']?.toString() == id);
      if (idx >= 0) {
        setState(() => _messages[idx] = {..._messages[idx], ...edited, 'isEdited': true});
      }
    });
    socket.onMessageDeleted((payload) {
      if (_disposed) return;
      if (payload is! Map) return;
      final id = payload['messageId']?.toString();
      if (id == null) return;
      final idx = _messages.indexWhere((m) => m['id']?.toString() == id);
      if (idx >= 0) {
        setState(() => _messages[idx] = {..._messages[idx], 'isDeleted': true, 'content': null});
      }
    });
    socket.onPresenceChanged((payload) {
      if (_disposed) return;
      if (payload is! Map) return;
      final uid = payload['userId']?.toString();
      if (uid == null || uid != _peerUserId) return;
      final p = payload['presence']?.toString().toUpperCase();
      setState(() => _peerOnline = p == 'ONLINE');
    });
    socket.onMessageReaction((payload) {
      if (_disposed) return;
      if (payload is! Map) return;
      final messageId = payload['messageId']?.toString();
      if (messageId == null) return;
      final idx = _messages.indexWhere((m) => m['id']?.toString() == messageId);
      if (idx < 0) return;
      final reactions = List<Map<String, dynamic>>.from(
        (_messages[idx]['reactions'] as List? ?? const []).map((e) => Map<String, dynamic>.from(e as Map)),
      );
      final userId = payload['userId']?.toString();
      final reactionType = payload['reactionType']?.toString();
      if (userId == null || reactionType == null) return;
      final existing = reactions.indexWhere((r) => r['userId']?.toString() == userId);
      if (existing >= 0) {
        reactions[existing]['type'] = reactionType;
      } else {
        reactions.add({'userId': userId, 'type': reactionType});
      }
      setState(() => _messages[idx] = {..._messages[idx], 'reactions': reactions});
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scroll.hasClients) return;
      _scroll.animateTo(
        _scroll.position.maxScrollExtent + 120,
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOut,
      );
    });
  }

  Future<void> _send({String? mediaUrl}) async {
    final text = _input.text.trim();
    if (text.isEmpty && mediaUrl == null) return;
    ref.read(socketServiceProvider).sendMessage(
          conversationId: widget.conversationId,
          content: text.isEmpty ? null : text,
          mediaUrl: mediaUrl,
          replyToId: _replyTo?['id']?.toString(),
        );
    setState(() {
      _messages.add({
        'id': 'local-${DateTime.now().microsecondsSinceEpoch}',
        'content': text,
        'mediaUrl': mediaUrl,
        'senderId': _myUserId,
        'createdAt': DateTime.now().toIso8601String(),
        'replyTo': _replyTo,
        'reactions': const [],
      });
      _typingUserId = null;
      _replyTo = null;
    });
    _input.clear();
    if (_typing) {
      _typing = false;
      ref.read(socketServiceProvider).stopTyping(widget.conversationId);
    }
    _scrollToBottom();
    try {
      await ref.read(apiServiceProvider).patch('/conversations/${widget.conversationId}/read', {});
    } catch (_) {}
  }

  Future<void> _attach() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery);
    if (picked == null) return;
    final url = await ref
        .read(mediaUploadServiceProvider)
        .uploadImage(picked, purpose: 'chat');
    await _send(mediaUrl: url);
  }

  Future<void> _aiReply() async {
    setState(() => _aiBusy = true);
    try {
      final last = _messages.isNotEmpty ? _messages.last['content']?.toString() ?? '' : '';
      final thread = _messages.map((m) => m['content']?.toString() ?? '').join('\n');
      final res = await ref.read(apiServiceProvider).post('/ai/reply-suggestions', {
        'thread': thread.isEmpty ? last : thread,
      });
      final data = res['data'] as Map<String, dynamic>?;
      final suggestions = data?['suggestions'] as List? ?? data?['replies'] as List?;
      final text = suggestions?.isNotEmpty == true
          ? suggestions!.first.toString()
          : (data?['output']?.toString() ?? '');
      if (text.isNotEmpty) _input.text = text;
    } catch (_) {
      final r = await ref.read(vyraAiServiceProvider).invoke(
            capability: 'reply_echo',
            text: _input.text,
          );
      _input.text = r.output;
    } finally {
      if (mounted) setState(() => _aiBusy = false);
    }
  }

  @override
  void dispose() {
    _disposed = true;
    ref.read(socketServiceProvider).updatePresence('OFFLINE');
    if (_typing) {
      ref.read(socketServiceProvider).stopTyping(widget.conversationId);
    }
    _input.removeListener(_onInputChanged);
    _input.dispose();
    _scroll.dispose();
    super.dispose();
  }

  String _timeLabel(dynamic iso) {
    final dt = DateTime.tryParse(iso?.toString() ?? '');
    if (dt == null) return '';
    final h = dt.hour.toString().padLeft(2, '0');
    final m = dt.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  Future<void> _openMessageActions(Map<String, dynamic> m) async {
    final mine = m['senderId']?.toString() == _myUserId;
    final id = m['id']?.toString();
    if (!mine || id == null || id.startsWith('local-')) return;
    final action = await showModalBottomSheet<String>(
      context: context,
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.reply_outlined),
              title: const Text('Reply'),
              onTap: () => Navigator.pop(context, 'reply'),
            ),
            ListTile(
              leading: const Icon(Icons.edit_outlined),
              title: const Text('Edit message'),
              onTap: () => Navigator.pop(context, 'edit'),
            ),
            ListTile(
              leading: const Icon(Icons.delete_outline),
              title: const Text('Delete for everyone'),
              onTap: () => Navigator.pop(context, 'delete'),
            ),
            Wrap(
              spacing: 8,
              children: ['LIKE', 'LOVE', 'WOW', 'HAHA']
                  .map(
                    (r) => ActionChip(
                      label: Text(r),
                      onPressed: () => Navigator.pop(context, 'react:$r'),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
    if (!mounted) return;
    if (action == 'reply') {
      setState(() => _replyTo = m);
      return;
    }
    if (action != null && action.startsWith('react:')) {
      final type = action.replaceFirst('react:', '');
      ref.read(socketServiceProvider).reactMessage(messageId: id, reactionType: type);
      return;
    }
    if (action == 'edit') {
      final ctl = TextEditingController(text: m['content']?.toString() ?? '');
      final updated = await showDialog<String>(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Edit message'),
          content: TextField(controller: ctl, maxLines: 4),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            FilledButton(onPressed: () => Navigator.pop(context, ctl.text.trim()), child: const Text('Save')),
          ],
        ),
      );
      if (!mounted) return;
      if (updated != null && updated.isNotEmpty) {
        ref.read(socketServiceProvider).editMessage(messageId: id, content: updated);
        final idx = _messages.indexWhere((e) => e['id']?.toString() == id);
        if (idx >= 0) {
          setState(() => _messages[idx] = {..._messages[idx], 'content': updated, 'isEdited': true});
        }
      }
    } else if (action == 'delete') {
      ref.read(socketServiceProvider).deleteMessage(messageId: id);
      final idx = _messages.indexWhere((e) => e['id']?.toString() == id);
      if (idx >= 0) {
        setState(() => _messages[idx] = {..._messages[idx], 'isDeleted': true, 'content': null});
      }
    }
  }

  bool _isSeenFor(Map<String, dynamic> message) {
    if (_lastReadAt == null) return false;
    final t = DateTime.tryParse(message['createdAt']?.toString() ?? '');
    if (t == null) return false;
    return t.isBefore(_lastReadAt!) || t.isAtSameMomentAs(_lastReadAt!);
  }

  String _reactionSummary(Map<String, dynamic> message) {
    final list = (message['reactions'] as List?) ?? const [];
    if (list.isEmpty) return '';
    final counts = <String, int>{};
    for (final item in list) {
      final t = (item as Map)['type']?.toString() ?? 'LIKE';
      counts[t] = (counts[t] ?? 0) + 1;
    }
    return counts.entries.map((e) => '${e.key}:${e.value}').join('  ');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.title),
            Text(
              _peerOnline ? 'online' : (_typingUserId != null ? 'typing…' : 'offline'),
              style: Theme.of(context).textTheme.labelSmall,
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: _aiBusy
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                : const Icon(Icons.auto_awesome),
            onPressed: _aiBusy ? null : _aiReply,
          ),
        ],
      ),
      body: Column(
        children: [
          if (_typingUserId != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Typing...',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
            ),
          Expanded(
            child: ListView.builder(
                controller: _scroll,
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length,
                itemBuilder: (_, i) {
                  final m = _messages[i];
                  final mine = m['senderId']?.toString() == _myUserId;
                  final media = m['mediaUrl']?.toString();
                  return Align(
                    alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
                    child: GestureDetector(
                      onLongPress: () => _openMessageActions(m),
                      child: GlassPanel(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: mine ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                          children: [
                            if (m['replyTo'] is Map)
                              Container(
                                margin: const EdgeInsets.only(bottom: 6),
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.06),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  ((m['replyTo'] as Map)['content']?.toString() ?? 'Media').trim(),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            if (media != null && media.isNotEmpty)
                              Image.network(media, height: 120, fit: BoxFit.cover),
                            if (m['isDeleted'] == true)
                              const Text('This message was deleted')
                            else if (m['content'] != null)
                              Text(m['content']?.toString() ?? '…'),
                            if (_reactionSummary(m).isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(
                                _reactionSummary(m),
                                style: Theme.of(context).textTheme.labelSmall,
                              ),
                            ],
                            const SizedBox(height: 4),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                if (m['isEdited'] == true)
                                  Text(
                                    'edited',
                                    style: Theme.of(context).textTheme.labelSmall,
                                  ),
                                if (m['isEdited'] == true) const SizedBox(width: 6),
                                Text(
                                  _timeLabel(m['createdAt']),
                                  style: Theme.of(context).textTheme.labelSmall,
                                ),
                                if (mine) ...[
                                  const SizedBox(width: 6),
                                  Icon(
                                    _isSeenFor(m) ? Icons.done_all : Icons.done,
                                    size: 14,
                                    color: _isSeenFor(m) ? Colors.lightBlueAccent : null,
                                  ),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              children: [
                if (_replyTo != null)
                  Container(
                    width: double.infinity,
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.06),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.reply_outlined, size: 16),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            (_replyTo?['content']?.toString() ?? 'Media').trim(),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, size: 16),
                          onPressed: () => setState(() => _replyTo = null),
                        ),
                      ],
                    ),
                  ),
                Row(
                  children: [
                    IconButton(icon: const Icon(Icons.attach_file), onPressed: _attach),
                    Expanded(
                      child: TextField(
                        controller: _input,
                        decoration: const InputDecoration(hintText: 'Transmit thought…'),
                        onSubmitted: (_) => _send(),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.send_rounded),
                      onPressed: () => _send(),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
