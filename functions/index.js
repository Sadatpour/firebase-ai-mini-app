const functions = require("firebase-functions");
const cors = require("cors");

const corsHandler = cors({
  origin: [
    "http://localhost:5000",
    "https://fir-ai-mini-app.web.app",
    "https://fir-ai-mini-app.firebaseapp.com"
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

exports.processMessage = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    // برای درخواست های OPTIONS (preflight requests) فقط پاسخ 204 ارسال می کنیم
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // برای درخواست های POST، یک پاسخ ساده برای تست موفقیت آمیز CORS ارسال می کنیم
    // منطق اصلی تابع در اینجا بازگردانده می شود اگر CORS کار کند
    res.status(200).json({ success: true, message: "CORS test successful!" });
  });
});
