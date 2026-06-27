// auth.js - نظام الدخول بالكود + جوال + باسورد
import { auth, db } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { showError, showSuccess } from './core.js';
import { t } from './lang.js';

// بيانات السوبر ادمن الثابتة
const SUPER_ADMIN = {
    code: '001122334455',
    phone: '0597087767',
    password: '500600'
};

// 1. تحويل كود+جوال لايميل وهمي
function generateEmail(projectCode, phone) {
    return `${projectCode.toLowerCase()}-${phone}@sndat.pro`;
}

// 2. تسجيل الدخول
export async function login(projectCode, phone, password) {
    try {
        // تشييك السوبر ادمن
        if (projectCode === SUPER_ADMIN.code && phone === SUPER_ADMIN.phone && password === SUPER_ADMIN.password) {
            const email = generateEmail(SUPER_ADMIN.code, SUPER_ADMIN.phone);
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                // لو أول مرة، ننشئ حساب السوبر
                if (error.code === 'auth/user-not-found') {
                    await createSuperAdmin();
                    await signInWithEmailAndPassword(auth, email, password);
                } else {
                    throw error;
                }
            }
            return { role: 'superadmin' };
        }

        // تسجيل دخول عادي للمدراء والمناديب
        const email = generateEmail(projectCode, phone);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // جيب بياناته من Firestore عشان نعرف صلاحيته
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (!userDoc.exists()) {
            throw new Error('بيانات المستخدم غير موجودة');
        }
        
        const userData = userDoc.data();
        
        // تشييك ان كود المشروع صح
        if (userData.projectCode !== projectCode) {
            await signOut(auth);
            throw new Error('كود المشروع غير صحيح');
        }

        return userData; // { role: 'manager' أو 'delegate', projectCode, phone, ... }

    } catch (error) {
        console.error(error);
        throw new Error(t('login_failed') + ': ' + error.message);
    }
}

// 3. إنشاء حساب السوبر ادمن أول مرة
async function createSuperAdmin() {
    const email = generateEmail(SUPER_ADMIN.code, SUPER_ADMIN.phone);
    const userCredential = await createUserWithEmailAndPassword(auth, email, SUPER_ADMIN.password);
    
    // احفظ بياناته في Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
        role: 'superadmin',
        phone: SUPER_ADMIN.phone,
        projectCode: SUPER_ADMIN.code,
        name: 'المدير العام',
        createdAt: new Date()
    });
}

// 4. إنشاء حساب مدير أو مندوب - يستخدمها السوبر ادمن
export async function createUser(projectCode, phone, password, role, name) {
    try {
        // تشييك هل الجوال مسجل بنفس المشروع قبل
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('projectCode', '==', projectCode), where('phone', '==', phone));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            throw new Error('رقم الجوال مسجل مسبقاً في هذا المشروع');
        }

        // إنشاء الحساب في Firebase Auth
        const email = generateEmail(projectCode, phone);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // حفظ البيانات في Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            role: role, // 'manager' أو 'delegate'
            phone: phone,
            projectCode: projectCode,
            name: name,
            permissions: role === 'manager' ? {
                add_delegate: true,
                view_reports: true,
                edit_bonds: true
            } : {
                add_bond: true,
                view_own_bonds: true
            },
            createdAt: new Date()
        });

        return { success: true, uid: userCredential.user.uid };

    } catch (error) {
        console.error(error);
        throw new Error('فشل إنشاء المستخدم: ' + error.message);
    }
}

// 5. جلب بيانات المستخدم الحالي
export async function getCurrentUserData() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    resolve({ uid: user.uid, ...userDoc.data() });
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

// 6. تشييك هل المستخدم سوبر ادمن
export async function isSuperAdmin() {
    const userData = await getCurrentUserData();
    return userData?.role === 'superadmin';
}

// 7. تسجيل الخروج
export async function logout() {
    await signOut(auth);
    localStorage.clear();
    window.location.href = 'index.html';
}
