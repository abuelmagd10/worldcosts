import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

Future<void> fetchFiles() async {
  final response = await http.get(Uri.parse('https://yourdomain.com/api/files'));
  if (response.statusCode == 200) {
    // معالجة البيانات
  }
}
class AdminPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('لوحة الإدارة'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Card(
              child: ListTile(
                leading: Icon(Icons.insert_drive_file, color: Colors.blue),
                title: Text('إدارة الملفات'),
                subtitle: Text('عرض وإدارة الملفات المرفوعة'),
                onTap: () {
                  // انتقل إلى صفحة إدارة الملفات
                },
              ),
            ),
            Card(
              child: ListTile(
                leading: Icon(Icons.settings, color: Colors.blue),
                title: Text('الإعدادات'),
                subtitle: Text('تكوين إعدادات التطبيق'),
                onTap: () {
                  // انتقل إلى صفحة الإعدادات
                },
              ),
            ),
            // أضف Widget لعرض إحصائيات الملفات إذا لزم الأمر
          ],
        ),
      ),
    );
  }
}