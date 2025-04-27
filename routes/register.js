// routes/register.js
const express = require('express');
const router = express.Router();

// التعامل مع طلبات POST على المسار /api/register
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // هنا يمكنك إضافة منطق تسجيل المستخدم
    // على سبيل المثال: تخزين البيانات في قاعدة بيانات أو التحقق من صحة البيانات

    // رد إيجابي بعد التسجيل
    res.status(200).send({ message: "User registered successfully" });
});

module.exports = router;

