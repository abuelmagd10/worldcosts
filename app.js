const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api'); // ✅ هذا اللي انت كتبته كويس
const app = express();
const PORT = process.env.PORT || 5000;

// إعدادات عامة
app.use(bodyParser.json());

// ربط المسارات APIs
app.use('/api', apiRoutes);

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
