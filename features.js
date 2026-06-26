// features.js - إدارة ميزات المشاريع
// السوبر ادمن يتحكم فيها عند إنشاء المشروع

// 1. الميزات الافتراضية اللي تظهر للسوبر ادمن مفعلّة عند إنشاء مشروع جديد
export const DEFAULT_FEATURES = {
    payment: true, // الدفع الالكتروني
    share_project: true, // مشاركة رابط المشروع
    whatsapp: true, // ارسال واتساب
    qr: true // طباعة QR كود
};

// 2. أسماء الميزات للعرض في الواجهة
export const FEATURE_LABELS = {
    payment: { ar: "الدفع الإلكتروني", en: "Online Payment" },
    share_project: { ar: "مشاركة المشروع", en: "Share Project" },
    whatsapp: { ar: "إرسال واتساب", en: "WhatsApp Send" },
    qr: { ar: "رمز QR للسند", en: "Bond QR Code" }
};

// 3. دالة تجيب ميزات مشروع معين من Firebase
// نستخدمها بعدين في كل الصفحات عشان نخفي/نظهر الأزرار
export function getProjectFeatures(projectData) {
    // لو المشروع ما عنده ميزات محفوظة، رجع الافتراضي
    return projectData?.features || DEFAULT_FEATURES;
}

// 4. دالة تشييك سريعة: هل الميزة شغالة في هذا المشروع؟
export function isFeatureEnabled(projectData, featureName) {
    const features = getProjectFeatures(projectData);
    return features[featureName] === true;
}
