// lang.js - ملف اللغة كامل جاهز نسخ لصق
const translations = {
    ar: {
        appName: "السندات الذكية",
        login: "تسجيل الدخول",
        phone: "رقم الجوال",
        password: "كلمة المرور",
        projectCode: "كود المشروع",
        error: "خطأ",
        fillAllFields: "عبي الجوال وكلمة السر",
        enterProjectCode: "ادخل كود المشروع",
        userNotFound: "المستخدم غير موجود",
        wrongPassword: "كلمة السر غلط",
        accountSuspended: "حسابك موقوف",
        projectSuspended: "المشروع موقوف",
        checkData: "تأكد من البيانات",
        logout: "خروج",
        delegate: "مندوب",
        dashboard: "الرئيسية",
        createBond: "إنشاء سند",
        myBonds: "سنداتي",
        printPreview: "معاينة الطباعة",
        smartSheet: "الصفحة الذكية",
        totalIncome: "إجمالي قبض سنداتي",
        totalExpense: "إجمالي صرف سنداتي",
        bondsCount: "عدد سنداتي",
        currency: "ريال سعودي",
        bond: "سند",
        noPermission: "تنبيه: لا تملك أي صلاحيات لإنشاء سندات. راجع مدير المشروع.",
        bondType: "نوع السند",
        selectBondType: "اختر نوع السند",
        amount: "المبلغ",
        date: "التاريخ",
        clientName: "اسم العميل",
        clientPhone: "جوال العميل",
        requiredForReceipt: "مطلوب لسندات القبض فقط",
        paymentMethod: "طريقة الدفع",
        selectPaymentMethod: "اختر طريقة الدفع",
        description: "البيان",
        saveBond: "حفظ السند",
        bondNumber: "رقم السند",
        type: "النوع",
        client: "العميل",
        actions: "تحكم",
        preview: "معاينة",
        print: "طباعة",
        selectBondToPreview: "اختر سند من تبويب \"سنداتي\" واضغط \"معاينة\" عشان تشوفه هنا",
        sendWhatsapp: "إرسال واتساب",
        sendToClient: "إرسال للعميل",
        downloadPdf: "تحميل PDF",
        search: "بحث...",
        exportExcel: "تصدير Excel",
        total: "الإجمالي:",
        receiver: "المستلم",
        accountant: "المحاسب",
        thankYou: "شكراً لتعاملكم معنا",
        dear: "عزيزي",
        receivedAmount: "تم استلام مبلغ",
        bondDetails: "تفاصيل السند",
        alert: "تنبيه",
        noClientPhone: "لا يوجد رقم جوال للعميل",
        comingSoon: "قريباً",
        exportSoon: "ميزة التصدير للإكسل قيد التطوير",
        changePassword: "تغيير كلمة السر",
        oldPassword: "كلمة السر القديمة",
        newPassword: "كلمة السر الجديدة",
        save: "حفظ",
        cancel: "إلغاء",
        wrongOldPassword: "كلمة السر القديمة غلط",
        passwordChanged: "تغيرت كلمة السر",
        done: "تم",
        rejected: "مرفوض",
        phoneRequiredForReceipt: "جوال العميل مطلوب لسندات القبض",
        invalidPhone: "رقم الجوال لازم يبدأ بـ 05 ويكون 10 أرقام",
        amountExceeded: "المبلغ تجاوز الحد المسموح للسند الواحد:",
        dailyLimitReached: "وصلت الحد الأقصى للسندات اليوم:",
        totalLimitReached: "وصلت الحد الأقصى لإجمالي السندات:",
        totalAmountExceeded: "إجمالي المبالغ راح يتجاوز الحد:",
        sequenceEnded: "وصلت لنهاية التسلسل لهذا النوع",
        bondSaved: "انحفظ السند رقم",
        termsAndConditions: "الشروط والأحكام",
        iAgree: "أوافق"
    },
    en: {
        appName: "Smart Bonds",
        login: "Login",
        phone: "Phone Number",
        password: "Password",
        projectCode: "Project Code",
        error: "Error",
        fillAllFields: "Fill phone and password",
        enterProjectCode: "Enter project code",
        userNotFound: "User not found",
        wrongPassword: "Wrong password",
        accountSuspended: "Your account is suspended",
        projectSuspended: "Project is suspended",
        checkData: "Check your data",
        logout: "Logout",
        delegate: "Delegate",
        dashboard: "Dashboard",
        createBond: "Create Bond",
        myBonds: "My Bonds",
        printPreview: "Print Preview",
        smartSheet: "Smart Sheet",
        totalIncome: "Total Receipts",
        totalExpense: "Total Expenses",
        bondsCount: "Bonds Count",
        currency: "SAR",
        bond: "Bond",
        noPermission: "Alert: You have no permissions to create bonds. Contact project manager.",
        bondType: "Bond Type",
        selectBondType: "Select Bond Type",
        amount: "Amount",
        date: "Date",
        clientName: "Client Name",
        clientPhone: "Client Phone",
        requiredForReceipt: "Required for receipt bonds only",
        paymentMethod: "Payment Method",
        selectPaymentMethod: "Select Payment Method",
        description: "Description",
        saveBond: "Save Bond",
        bondNumber: "Bond Number",
        type: "Type",
        client: "Client",
        actions: "Actions",
        preview: "Preview",
        print: "Print",
        selectBondToPreview: "Select a bond from 'My Bonds' and click 'Preview' to view it here",
        sendWhatsapp: "Send WhatsApp",
        sendToClient: "Send to Client",
        downloadPdf: "Download PDF",
        search: "Search...",
        exportExcel: "Export Excel",
        total: "Total:",
        receiver: "Receiver",
        accountant: "Accountant",
        thankYou: "Thank you for your business",
        dear: "Dear",
        receivedAmount: "Amount received",
        bondDetails: "Bond Details",
        alert: "Alert",
        noClientPhone: "No client phone number",
        comingSoon: "Coming Soon",
        exportSoon: "Excel export feature is under development",
        changePassword: "Change Password",
        oldPassword: "Old Password",
        newPassword: "New Password",
        save: "Save",
        cancel: "Cancel",
        wrongOldPassword: "Old password is wrong",
        passwordChanged: "Password changed",
        done: "Done",
        rejected: "Rejected",
        phoneRequiredForReceipt: "Client phone is required for receipt bonds",
        invalidPhone: "Phone must start with 05 and be 10 digits",
        amountExceeded: "Amount exceeded the limit per bond:",
        dailyLimitReached: "Daily bond limit reached:",
        totalLimitReached: "Total bonds limit reached:",
        totalAmountExceeded: "Total amount will exceed the limit:",
        sequenceEnded: "Reached the end of sequence for this type",
        bondSaved: "Bond saved number",
        termsAndConditions: "Terms & Conditions",
        iAgree: "I Agree"
    }
};

let currentLang = localStorage.getItem('language') || 'ar';
if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'ar');
}

function t(key) {
    return translations[currentLang][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    applyLanguage();
}

function applyLanguage() {
    const lang = localStorage.getItem('language') || 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar'? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

export { t, setLanguage, applyLanguage };
