import 'package:flutter/material.dart';

class FileStats extends StatelessWidget {
  final int filesCount;
  final int totalSize;

  const FileStats({Key? key, required this.filesCount, required this.totalSize}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Theme.of(context).cardColor,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(Icons.insert_drive_file, color: Colors.blue),
            SizedBox(width: 12),
            Text('عدد الملفات: $filesCount', style: TextStyle(color: Colors.white)),
            SizedBox(width: 24),
            Text('الحجم الكلي: $totalSize ميجابايت', style: TextStyle(color: Colors.white)),
          ],
        ),
      ),
    );
  }
}