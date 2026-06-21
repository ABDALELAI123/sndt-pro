// ===== firebase.js =====
// ملف إعدادات الفايربيس المشترك لكل الصفحات
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBvEU1Cmt1IX4h0xaCd6McaOMufvGqr2fY",
    authDomain: "sanadat-pro.firebaseapp.com",
    databaseURL: "https://sanadat-pro-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sanadat-pro",
    storageBucket: "sanadat-pro.firebasestorage.app",
    messagingSenderId: "1039476751095",
    appId: "1:1039476751095:web:f2a7744d6469385e7771f2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
export const SUPERADMIN = { phone: "0597087767", password: "500600", name: "المدير العام" };
