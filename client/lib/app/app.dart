import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router.dart';
import 'theme.dart';

class VyraApp extends StatelessWidget {
  const VyraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: MaterialApp.router(
        title: 'VYRA',
        debugShowCheckedModeBanner: false,
        theme: VyraTheme.dark(),
        routerConfig: appRouter,
      ),
    );
  }
}
