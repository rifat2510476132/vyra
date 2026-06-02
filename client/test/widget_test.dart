import 'package:flutter_test/flutter_test.dart';
import 'package:vyra_client/app/app.dart';

void main() {
  testWidgets('VYRA app smoke test', (tester) async {
    await tester.pumpWidget(const VyraApp());
    expect(find.text('VYRA'), findsOneWidget);
  });
}
