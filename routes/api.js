
const express = require('express');
const router = express.Router();

const API_KEY = "mysecretkey123"; // 🔒 مفتاح حماية بسيط

// مكان حفظ المستخدمين والبيانات (ذاكرة مؤقتة فقط)
const users = [];
const data = [];

// ميدل وير لفحص الـ API KEY
function verifyApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (key === API_KEY) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }
}

// تسجيل مستخدم
router.post('/register', verifyApiKey, (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  users.push({ username, password });
  res.json({ message: 'User registered successfully' });
});

// تسجيل دخول
router.post('/login', verifyApiKey, (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// إدخال بيانات
router.post('/data', verifyApiKey, (req, res) => {
  data.push(req.body);
  res.json({ message: 'Data saved successfully' });
});

// عرض البيانات
router.get('/data', verifyApiKey, (req, res) => {
  res.json(data);
});

module.exports = router;
