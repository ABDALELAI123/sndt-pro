// core.js - الدوال الأساسية للنظام
import { t } from './lang.js';
import { auth } from './firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 1. تسجيل الخروج
export async function logout() {
    await signOut(auth);
    localStorage.clear();
    window.location.href = 'index.html';
}

// 2. تنسيق التاريخ ميلادي: 27/06/2026
export function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
}

// 3. تنسيق الفلوس: 1,500.00 ر.س
export function formatMoney(amount) {
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + t('currency');
}

// 4. رسالة نجاح
export function showSuccess(msg) {
    Swal.fire({
        icon: 'success',
        title: t('done'),
        text: msg,
        timer: 2000,
        showConfirmButton: false
    });
}

// 5. رسالة خطأ
export function showError(msg) {
    Swal.fire({
        icon: 'error',
        title: t('error'),
        text: msg
    });
}

// 6. رسالة تأكيد
export async function showConfirm(msg) {
    const result = await Swal.fire({
        icon: 'question',
        title: t('alert'),
        text: msg,
        showCancelButton: true,
        confirmButtonText: t('save'),
        cancelButtonText: t('cancel')
    });
    return result.isConfirmed;
}

// 7. تشييك صلاحية المستخدم
export function hasPermission(userData, permission) {
    if (!userData ||!userData.permissions) return false;
    return userData.permissions[permission] === true;
}

// 8. منع دخول الصفحة لو المستخدم مو مسجل
export function requireAuth() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'index.html';
        }
    });
}
