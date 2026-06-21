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
        checkData: "تأكد من البيانات"
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
        checkData: "Check your data"
    }
};

// عربي افتراضي لو ما اختار شي
let currentLang = localStorage.getItem('language') || 'ar';
if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'ar'); // نخزن العربي كافتراضي
}

function t(key) {
    return translations[currentLang][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar'? 'rtl' : 'ltr';
    document.getElementById('languageModal').classList.add('hidden');
    applyLanguage();
}

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar'? 'rtl' : 'ltr';
}

export { t, setLanguage, applyLanguage };
