// config.js - إعدادات النظام الأساسية لسندات برو
// v2.0.0 - 2026/06/29

const firebaseConfig = {
  apiKey: "AIzaSyBvEU1Cmt1IX4h0xaCd6McaOMufvGqr2fY",
  authDomain: "sanadat-pro.firebaseapp.com",
  databaseURL: "https://sanadat-pro-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sanadat-pro",
  storageBucket: "sanadat-pro.firebasestorage.app",
  messagingSenderId: "1039476751095",
  appId: "1:1039476751095:web:f2a7744d6469385e7771f2"
};

const appConfig = {
  baseUrl: "https://abdalelai123.github.io/sndt-pro",
  superAdminCode: "001122334455",
  superAdminPhone: "0597087767",
  superAdminEmail: "001122334455-0597087767@sanadat.pro",
  appVersion: "2.0.0",
  appName: "سندات برو",
  currency: "SAR",
  currencyName: "ريال سعودي",
  defaultLanguage: "ar",
  dateFormat: "ar-SA"
};

// تصدير للـ ES Modules
export { firebaseConfig, appConfig };

// تصدير للـ window للملفات القديمة
window.firebaseConfig = firebaseConfig;
window.appConfig = appConfig;
