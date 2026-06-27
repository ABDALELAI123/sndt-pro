// config.js - إعدادات النظام الأساسية
const firebaseConfig = {
  apiKey: "AIzaSyBvEU1Cmt1IX4h0xaCd6McaOMufvGqr2fY",
  authDomain: "sanadat-pro.firebaseapp.com",
  databaseURL: "https://sanadat-pro-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sanadat-pro",
  storageBucket: "sanadat-pro.firebasestorage.app",
  messagingSenderId: "1039476751095",
  appId: "1:1039476751095:web:f2a7744d6469385e7771f2"
};

// اعدادات اضافية للموقع
const appConfig = {
  baseUrl: "https://abdalelai123.github.io/sndt-pro",
  رمز_المشرف_الافتراضي: "001122334455",
  إصدار_التطبيق: "1.0.0",
  هاتف_الدعم: "0597087767"
};

// تصدير للاستخدام في باقي الملفات
window.firebaseConfig = firebaseConfig;
window.appConfig = appConfig;
