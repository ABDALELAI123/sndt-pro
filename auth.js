// auth.js - نظام الدخول الموحد لسندات برو
// v2.2.0 - 2026/06/30 - حماية السوبر ادمن من الطرد نهائياً

import { auth, db } from './firebase.js?v=9999999';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { showError, showSuccess, cleanPhone } from './core.js?v=9999999';
import { appConfig } from './config.js?v=9999999';

const SUPER_ADMIN_EMAIL = appConfig.superAdminEmail;
const SUPER_ADMIN_CODE = appConfig.superAdminCode;
const SUPER_ADMIN_PHONE = appConfig.superAdminPhone;

// دالة تسجيل الدخول - بدون تحويل تلقائي
export async function login(projectCode, phone, password) {
    try {
        // 1. حالة السوبر ادمن
        if (phone === SUPER_ADMIN_PHONE && projectCode === SUPER_ADMIN_CODE) {
            const email = SUPER_ADMIN_EMAIL;
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    // أول مرة - نسوي الحساب
                    const userCred = await createUserWithEmailAndPassword(auth, email, password);
                    await setDoc(doc(db, 'users', userCred.user.uid), {
                        name: 'السوبر ادمن',
                        phone: phone,
                        email: email,
                        projectCode: projectCode,
                        role: 'superadmin',
                        active: true,
                        createdAt: serverTimestamp()
                    });
                } else {
                    throw error;
                }
            }
            return await getCurrentUserData();
        }

        // 2. حالة المدراء والمناديب
        const cleanPhoneNum = cleanPhone(phone);
        const email = `${projectCode}-${cleanPhoneNum.replace('+', '')}@sanadat.pro`;
        
        await signInWithEmailAndPassword(auth, email, password);
        return await getCurrentUserData();

    } catch (error) {
        console.error('Login Error:', error);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            throw new Error('كلمة المرور أو بيانات الدخول خاطئة');
        } else if (error.code === 'auth/user-not-found') {
            throw new Error('المستخدم غير موجود. تأكد من كود المشروع ورقم الجوال');
        } else {
            throw new Error('فشل تسجيل الدخول: ' + error.message);
        }
    }
}

// إنشاء مستخدم جديد
export async function createUser(projectCode, phone, password, role, name) {
    try {
        const cleanPhoneNum = cleanPhone(phone);
        const email = `${projectCode}-${cleanPhoneNum.replace('+', '')}@sanadat.pro`;
        
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        
        await setDoc(doc(db, 'users', userCred.user.uid), {
            name: name,
            phone: cleanPhoneNum,
            email: email,
            projectCode: projectCode,
            role: role,
            active: true,
            createdAt: serverTimestamp(),
            createdBy: auth.currentUser?.uid || 'system'
        });

        return userCred.user;
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('رقم الجوال مستخدم من قبل في هذا المشروع');
        }
        throw error;
    }
}

// جلب بيانات المستخدم الحالي - حماية صارمة للسوبر ادمن
export async function getCurrentUserData() {
    const user = auth.currentUser;
    if (!user) return null;

    // سوبر ادمن - يرجع دائماً active: true حتى لو انحذف من Firestore
    if (user.email === SUPER_ADMIN_EMAIL) {
        return {
            uid: user.uid,
            email: user.email,
            role: 'superadmin',
            name: 'السوبر ادمن',
            projectCode: SUPER_ADMIN_CODE,
            phone: SUPER_ADMIN_PHONE,
            active: true // ← إجباري true للسوبر ادمن
        };
    }

    // باقي المستخدمين - من قاعدة البيانات
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
        return null; // نخلي index.html يتعامل معاه
    }

    const data = userDoc.data();
    return { uid: user.uid, ...data };
}

// تسجيل خروج
export async function logout() {
    await signOut(auth);
    window.location.href = 'index.html';
}
