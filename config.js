// config.js - إعدادات النظام الأساسية
import { app, auth, db, storage } from './firebase.js';

export const CONFIG = {
    // 1. خدمات Firebase - جايه من firebase.js حقك
    firebase: { app, auth, db, storage },
    
    // 2. رابط موقعك على GitHub Pages
    baseUrl: "https://abdalelai123.github.io/sndt-pro",
    
    // 3. اللوقو الافتراضي لو المشروع ما رفع لوقو
    defaultLogo: "https://via.placeholder.com/150x60?text=Smart+Bonds",
    
    // 4. كود السوبر ادمن الثابت - احفظه عندك
    superAdminCode: "001122334455",
    
    // 5. معلومات إضافية
    appVersion: "1.0.0",
    supportPhone: "0597087767"
};
