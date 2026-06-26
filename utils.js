// utils.js - دوال مساعدة للنظام

// 1. توليد كود مشروع عشوائي 8 خانات
export function generateProjectCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// 2. توليد رقم سند تسلسلي - يدعم رقم بداية وبادئة مخصصة لكل مشروع
export function generateBondNumber(lastNumber, projectData) {
    const startFrom = parseInt(projectData?.bondStartNumber) || 1; // رقم البداية من المشروع
    const prefix = projectData?.bondPrefix || ''; // البادئة مثل INV- أو RCPT-
    const padding = projectData?.bondNumberLength || 6; // طول الرقم، افتراضي 6 خانات

    // لو هذا أول سند في المشروع، نستخدم رقم البداية
    let nextNum;
    if (!lastNumber || lastNumber === 0 || lastNumber < startFrom) {
        nextNum = startFrom;
    } else {
        nextNum = parseInt(lastNumber) + 1;
    }

    // مثال النتيجة: INV-001000 أو 000001
    return prefix + nextNum.toString().padStart(padding, '0');
}

// 3. التحقق من رقم جوال سعودي
export function isValidSaudiPhone(phone) {
    const cleaned = phone.replace(/\s|-/g, '');
    return /^05\d{8}$/.test(cleaned);
}

// 4. تنظيف رقم الجوال من المسافات والرموز
export function cleanPhone(phone) {
    return phone.replace(/\s|-/g, '');
}

// 5. تحويل الأرقام انجليزي إلى عربي
export function toArabicNumbers(str) {
    const arabicNumbers = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return str.toString().replace(/[0-9]/g, (w) => arabicNumbers[+w]);
}

// 6. تحويل الأرقام عربي إلى انجليزي
export function toEnglishNumbers(str) {
    return str.toString()
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
}

// 7. توليد رابط QR للسند
export function generateBondQRUrl(baseUrl, projectCode, bondId) {
    return `${baseUrl}/bonds.html?project=${projectCode}&id=${bondId}`;
}

// 8. تأخير تنفيذ - نستخدمه مع Firebase
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 9. اختصار النص الطويل
export function truncateText(text, maxLength = 50) {
    if (!text) return '';
    return text.length > maxLength? text.substring(0, maxLength) + '...' : text;
}

// 10. تاريخ اليوم بصيغة YYYY-MM-DD للـ input date
export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// 11. التحقق من صحة رقم البداية
export function isValidStartNumber(num) {
    const n = parseInt(num);
    return!isNaN(n) && n > 0 && n < 100000000; // أقل من 100 مليون
}
