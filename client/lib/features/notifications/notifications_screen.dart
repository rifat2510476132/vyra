import 'package:flutter/material.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/services/api_service.dart';

import '../../core/services/socket_service.dart';

import '../../core/widgets/glass_panel.dart';

import '../../core/widgets/particle_background.dart';



class NotificationsScreen extends ConsumerStatefulWidget {

  const NotificationsScreen({super.key});



  @override

  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();

}



class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {

  List<dynamic> _items = const [];

  bool _loading = true;



  @override

  void initState() {

    super.initState();

    _load();

    WidgetsBinding.instance.addPostFrameCallback((_) {

      ref.read(socketServiceProvider).connect();

      ref.read(socketServiceProvider).onNotification((_) => _load());

    });

  }



  Future<void> _load() async {

    try {

      final res = await ref.read(apiServiceProvider).get('/notifications');

      if (mounted) {

        setState(() {

          _items = (res['data'] as List?) ?? [];

          _loading = false;

        });

      }

    } catch (_) {

      if (mounted) setState(() => _loading = false);

    }

  }



  Future<void> _markRead(String id) async {

    await ref.read(apiServiceProvider).patch('/notifications/$id/read', {});

    await _load();

  }



  Future<void> _markAllRead() async {

    await ref.read(apiServiceProvider).patch('/notifications/read-all', {});

    await _load();

  }



  @override

  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(

        title: const Text('Quantum Alerts'),

        actions: [

          if (_items.any((n) => (n as Map)['isRead'] != true))

            TextButton(onPressed: _markAllRead, child: const Text('Read all')),

        ],

      ),

      body: ParticleBackground(

        child: _loading

            ? const Center(child: CircularProgressIndicator())

            : RefreshIndicator(

                onRefresh: _load,

                child: ListView.builder(

                  padding: const EdgeInsets.all(16),

                  itemCount: _items.isEmpty ? 1 : _items.length,

                  itemBuilder: (_, i) {

                    if (_items.isEmpty) {

                      return const Padding(

                        padding: EdgeInsets.all(32),

                        child: Center(child: Text('No alerts yet')),

                      );

                    }

                    final n = _items[i] as Map<String, dynamic>;

                    final unread = n['isRead'] != true;

                    return Padding(

                      padding: const EdgeInsets.only(bottom: 8),

                      child: GlassPanel(

                        child: ListTile(

                          onTap: unread ? () => _markRead(n['id'].toString()) : null,

                          title: Text(n['title']?.toString() ?? 'Alert'),

                          subtitle: Text(n['body']?.toString() ?? ''),

                          trailing: unread

                              ? const Icon(Icons.brightness_1, size: 10)

                              : null,

                        ),

                      ),

                    );

                  },

                ),

              ),

      ),

    );

  }

}


