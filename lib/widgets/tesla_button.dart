import 'package:flutter/material.dart';

class TeslaButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Color? color;

  const TeslaButton({Key? key, required this.text, required this.onPressed, this.color}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: color ?? Color(0xFF0074D9), // لون أزرق مشابه للويب
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
      onPressed: onPressed,
      child: Text(text, style: TextStyle(fontWeight: FontWeight.bold)),
    );
  }
}