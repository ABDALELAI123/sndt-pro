// core.js - الدوال الأساسية لسندات برو
// v2.0.0 - 2026/06/29

import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

// رسائل التنبيه
export function showSuccess(msg) {
    return Swal.fire({ icon: 'success', title: 'تم', text: msg, timer: 2000, showConfirmButton: false });
}

export function showError(msg) {
    return Swal.fire({ icon: 'error', title: 'خطأ', text: msg });
}

export function showConfirm(title, text) {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#dc2626'
    });
}

// تنسيق التاريخ
export function formatDate(timestamp) {
    if (!timestamp) return '-';
    const date = timestamp.toDate? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// تنسيق المبلغ
export function formatMoney(amount) {
    if (!amount && amount!== 0) return '0 ر.س';
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

// تحويل الرقم إلى نص - تفقيط المبالغ
export function tafqeet(num) {
    if (num === null || num === undefined || isNaN(num)) return '';
    if (num === 0) return 'صفر ريال سعودي فقط لا غير';

    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
    const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const hundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

    function convertThreeDigits(n) {
        let result = '';
        const h = Math.floor(n / 100);
        const t = n % 100;

        if (h > 0) {
            result += hundreds[h];
            if (t > 0) result += ' و ';
        }

        if (t >= 20) {
            const ten = Math.floor(t / 10);
            const one = t % 10;
            if (one > 0) result += ones[one] + ' و ';
            result += tens[ten];
        } else if (t >= 11) {
            const special = ['أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
            result += special[t - 11];
        } else if (t === 10) {
            result += 'عشرة';
        } else if (t > 0) {
            result += ones[t];
        }

        return result;
    }

    let integerPart = Math.floor(Math.abs(num));
    const decimalPart = Math.round((Math.abs(num) - integerPart) * 100);

    let result = '';

    if (integerPart >= 1000000000) {
        const b = Math.floor(integerPart / 1000000000);
        if (b === 1) result += 'مليار ';
        else if (b === 2) result += 'ملياران ';
        else if (b <= 10) result += convertThreeDigits(b) + ' مليارات ';
        else result += convertThreeDigits(b) + ' مليار ';
        integerPart %= 1000000000;
    }

    if (integerPart >= 1000000) {
        const m = Math.floor(integerPart / 1000000);
        if (m === 1) result += 'مليون ';
        else if (m === 2) result += 'مليونان ';
        else if (m <= 10) result += convertThreeDigits(m) + ' ملايين ';
        else result += convertThreeDigits(m) + ' مليون ';
        integerPart %= 1000000;
    }

    if (integerPart >= 1000) {
        const th = Math.floor(integerPart / 1000);
        if (th === 1) result += 'ألف ';
        else if (th === 2) result += 'ألفان ';
        else if (th <= 10) result += convertThreeDigits(th) + ' آلاف ';
        else result += convertThreeDigits(th) + ' ألف ';
        integerPart %= 1000;
    }

    if (integerPart > 0) {
        result += convertThreeDigits(integerPart);
    }

    result = result.trim();

    if (decimalPart > 0) {
        result += ' و ' + convertThreeDigits(decimalPart) + ' هللة';
    }

    if (num < 0) result = 'سالب ' + result;

    return result + ' ريال سعودي فقط لا غير';
}

// تصدير كل الدوال
export { showSuccess, showError, showConfirm, formatDate, formatMoney, tafqeet };
