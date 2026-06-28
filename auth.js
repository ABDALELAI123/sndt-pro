// auth.js - نسخة مصححة نهائياً للسوبر ادمن اليدوي
import { auth, db } from './firebase.js?v=999999';
import { 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { showError } from './core.js?v=999999';

// بيانات السوبر ادمن الثابتة
const SUPER_ADMIN = {
    code: '001122334455',
    phone: '0597087767',
    password: '500600',
    email: '001122334455-0597087767@sanadat.pro'
};

// 1. تحويل كود+جوال لايميل وهمي
function generateEmail(projectCode, phone) {
    const email = `${projectCode.toLowerCase()}-${phone}@sanadat.pro`;
    return email;
}

// 2. تسجيل الدخول
export async function login(projectCode, phone, password) {
    try {
        console.log('login استقبل:', { projectCode, phone, password: '***' });
        
        // تشييك السوبر ادمن أول - ما نحتاج ننشئه لأنه موجود يدوي
        if (projectCode === SUPER_ADMIN.code && phone === SUPER_ADMIN.phone && password === SUPER_ADMIN.password) {
            console.log('محاولة دخول السوبر ادمن');
            const userCredential = await signInWithEmailAndPassword(auth, SUPER_ADMIN.email, password);
            console.log('تم دخول السوبر ادمن');
            return { role: 'superadmin', projectCode: SUPER_ADMIN.code };
        }

        // تسجيل دخول عادي
        const email = generateEmail(projectCode, phone);
        console.log('محاولة دخول عادي بالإيميل:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (!userDoc.exists()) {
            await signOut(auth);
            throw new Error('بيانات المستخدم غير موجودة');
        }
        
        const userData = userDoc.data();
        
        if (userData.projectCode !== projectCode) {
            await signOut(auth);
            throw new Error('كود المشروع غير صحيح');
        }
        
        if (userData.active === false) {
            await signOut(auth);
            throw new Error('تم إيقاف حسابك');
        }

        return userData;

    } catch (error) {
        console.error('خطأ في login:', error);
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            throw new Error('بيانات الدخول غير صحيحة');
        }
        throw new Error(error.message);
    }
}

// 3. إنشاء مشروع جديد
export async function createProject(projectName) {
    const projectCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    await addDoc(collection(db, 'projects'), {
        code: projectCode,
        name: projectName,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
        active: true
    });

    return { success: true, projectCode: projectCode };
}

// 4. إنشاء حساب مدير أو مندوب
export async function createUser(projectCode, phone, password, role, name) {
    try {
        const projectsRef = collection(db, 'projects');
        const qProject = query(projectsRef, where('code', '==', projectCode), where('active', '==', true));
        const projectSnap = await getDocs(qProject);
        if (projectSnap.empty) {
            throw new Error('كود المشروع غير موجود أو غير نشط');
        }

        const usersRef = collection(db, 'users');
        const qUser = query(usersRef, where('projectCode', '==', projectCode), where('phone', '==', phone));
        const userSnap = await getDocs(qUser);
        
        if (!userSnap.empty) {
            throw new Error('رقم الجوال مسجل مسبقاً في هذا المشروع');
        }

        const email = generateEmail(projectCode, phone);
        // استورد createUserWithEmailAndPassword هنا لو احتجته
        const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            role: role,
            phone: phone,
            projectCode: projectCode,
            name: name,
            email: email,
            active: true,
            permissions: role === 'manager' ? {
                add_delegate: true,
                view_reports: true,
                edit_bonds: true,
                create_delegate: true
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
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
