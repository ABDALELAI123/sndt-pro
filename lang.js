const translations = {
    ar: {
        // عام
        appName: "السندات الذكية",
        logout: "خروج",
        changePassword: "تغيير كلمة السر",
        save: "حفظ",
        cancel: "إلغاء",
        print: "طباعة",
        whatsapp: "إرسال واتساب",
        whatsappClient: "إرسال للعميل",
        downloadPDF: "تحميل PDF",
        search: "بحث...",

        // الأدوار
        role_superadmin: "مدير النظام",
        role_admin: "مدير",
        role_delegate: "مندوب",

        // تسجيل الدخول
        login: "تسجيل الدخول",
        phone: "رقم الجوال",
        password: "كلمة السر",
        selectLanguage: "اختر اللغة",
        arabic: "العربية",
        english: "English",

        // المندوب
        dashboard: "الرئيسية",
        createBond: "إنشاء سند",
        myBonds: "سنداتي",
        printPreview: "معاينة الطباعة",
        smartSheet: "الصفحة الذكية",
        totalIncome: "إجمالي قبض سنداتي",
        totalExpense: "إجمالي صرف سنداتي",
        totalBonds: "عدد سنداتي",
        bondType: "نوع السند",
        amount: "المبلغ",
        date: "التاريخ",
        clientName: "اسم العميل",
        clientPhone: "جوال العميل",
        paymentMethod: "طريقة الدفع",
        description: "البيان",
        saveBond: "حفظ السند",
        bondNumber: "رقم السند",
        bondReceipt: "سند قبض",
        bondPayment: "سند صرف",
        accountant: "المحاسب",
        receiver: "المستلم",
        riyal: "ريال سعودي",
        requiredForReceipt: "مطلوب لسندات القبض فقط",

        // الرسائل
        success: "تم",
        error: "خطأ",
        warning: "تنبيه",
        bondSaved: "انحفظ السند رقم",
        fillAllFields: "عبي كل الحقول المطلوبة",
        noPermission: "ما عندك صلاحية لإنشاء سند من هذا النوع",
        phoneRequired: "جوال العميل مطلوب لسندات القبض",
        invalidPhone: "رقم الجوال لازم يبدأ بـ 05 ويكون 10 أرقام",
        noClientPhone: "لا يوجد رقم جوال للعميل"
    },

    en: {
        // General
        appName: "Smart Bonds",
        logout: "Logout",
        changePassword: "Change Password",
        save: "Save",
        cancel: "Cancel",
        print: "Print",
        whatsapp: "Send WhatsApp",
        whatsappClient: "Send to Client",
        downloadPDF: "Download PDF",
        search: "Search...",

        // Roles
        role_superadmin: "Super Admin",
        role_admin: "Admin",
        role_delegate: "Delegate",

        // Login
        login: "Login",
        phone: "Phone Number",
        password: "Password",
        selectLanguage: "Select Language",
        arabic: "العربية",
        english: "English",

        // Delegate
        dashboard: "Dashboard",
        createBond: "Create Bond",
        myBonds: "My Bonds",
        printPreview: "Print Preview",
        smartSheet: "Smart Sheet",
        totalIncome: "Total Receipt Bonds",
        totalExpense: "Total Payment Bonds",
        totalBonds: "Total Bonds Count",
        bondType: "Bond Type",
        amount: "Amount",
        date: "Date",
        clientName: "Client Name",
        clientPhone: "Client Phone",
        paymentMethod: "Payment Method",
        description: "Description",
        saveBond: "Save Bond",
        bondNumber: "Bond Number",
        bondReceipt: "Receipt Voucher",
        bondPayment: "Payment Voucher",
        accountant: "Accountant",
        receiver: "Receiver",
        riyal: "SAR",
        requiredForReceipt: "Required for receipt bonds only",

        // Messages
        success: "Success",
        error: "Error",
        warning: "Warning",
        bondSaved: "Bond saved successfully",
        fillAllFields: "Please fill all required fields",
        noPermission: "You don't have permission to create this bond type",
        phoneRequired: "Client phone is required for receipt bonds",
        invalidPhone: "Phone must start with 05 and be 10 digits",
        noClientPhone: "No client phone number available"
    }
};

// دالة الترجمة
function t(key) {
    const lang = localStorage.getItem('language') || 'ar';
    return translations[lang][key] || key;
}

// دالة تغيير اللغة
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar'? 'rtl' : 'ltr';
    location.reload();
}

// تطبيق اللغة عند تحميل الصفحة
function applyLanguage() {
    const lang = localStorage.getItem('language') || 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar'? 'rtl' : 'ltr';

    // ترجم كل العناصر اللي فيها data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // ترجم الـ placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
}

export { t, setLanguage, applyLanguage };
