// auth.js - الإصدار 2.1 - حل مشكلة تسجيل الخروج التلقائي
import { auth, db } from './firebase.js?v=999999';
import { 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    initializeApp,
    deleteApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
    return `${projectCode.toLowerCase()}-${phone}@sanadat.pro`;
}

// 2. تسجيل الدخول
export async function login(projectCode, phone, password) {
    try {
        // تشييك السوبر ادمن أول
        if (projectCode === SUPER_ADMIN.code && phone === SUPER_ADMIN.phone && password === SUPER_ADMIN.password) {
            const userCredential = await signInWithEmailAndPassword(auth, SUPER_ADMIN.email, password);
            window.location.href = "admin-panel.html";
            return { role: 'superadmin', projectCode: SUPER_ADMIN.code };
        }

        // تسجيل دخول عادي
        const email = generateEmail(projectCode, phone);
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
            throw new Error('تم إيقاف حسابك. تواصل مع الإدارة');
        }

        // تحويل حسب الدور
        if (['admin', 'manager', 'viewer'].includes(userData.role)) {
            window.location.href = "admin-panel.html";
        } else if (userData.role === 'delegate') {
            window.location.href = "delegate.html";
        } else {
            window.location.href = "index.html";
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

// 3. إنشاء مشروع جديد - للسوبر ادمن فقط
export async function createProject(projectName) {
    const projectCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    await addDoc(collection(db, 'projects'), {
        code: projectCode,
        name: projectName,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
        active: true,
        settings: {
            logo: '',
            terms: '',
            showCreateBond: true,
            showBondsTab: true
        }
    });

    return { success: true, projectCode: projectCode };
}

// 4. إنشاء حساب مدير أو مندوب - الحل الجذري هنا
export async function createUser(projectCode, phone, password, role, name) {
    let secondaryApp;
    try {
        // تشييك المشروع
        const projectsRef = collection(db, 'projects');
        const qProject = query(projectsRef, where('code', '==', projectCode), where('active', '==', true));
        const projectSnap = await getDocs(qProject);
        if (projectSnap.empty) {
            throw new Error('كود المشروع غير موجود أو غير نشط');
        }

        // تشييك تكرار الجوال
        const usersRef = collection(db, 'users');
        const qUser = query(usersRef, where('projectCode', '==', projectCode), where('phone', '==', phone));
        const userSnap = await getDocs(qUser);
        if (!userSnap.empty) {
            throw new Error('رقم الجوال مسجل مسبقاً في هذا المشروع');
        }

        const email = generateEmail(projectCode, phone);
        
        // الحل: ننشئ App ثانوي مؤقت عشان ما يطرد السوبر ادمن
        const secondaryAppConfig = auth.app.options;
        secondaryApp = initializeApp(secondaryAppConfig, `secondary-${Date.now()}`);
        const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
        const secondaryAuth = getAuth(secondaryApp);
        
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        
        // صلاحيات حسب الدور
        let permissions = {};
        if (role === 'admin') {
            permissions = { manage_managers: true, manage_delegates: true, manage_bonds: true, edit_settings: true, delete_items: true };
        } else if (role === 'manager') {
            permissions = { manage_delegates: true, manage_bonds: true, add_delegate: true, view_reports: true };
        } else if (role === 'viewer') {
            permissions = { view_bonds: true };
        } else if (role === 'delegate') {
            permissions = { add_bond: true, view_own_bonds: true };
        }
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            role: role,
            phone: phone,
            projectCode: projectCode,
            name: name,
            email: email,
            active: true,
            permissions: permissions,
            createdAt: new Date()
        });

        // نحذف الـ App الثانوي ونرجع للرئيسي
        await signOut(secondaryAuth);
        await deleteApp(secondaryApp);

        return { success: true, uid: userCredential.user.uid };

    } catch (error) {
        // تنظيف لو صار خطأ
        if (secondaryApp) {
            try { await deleteApp(secondaryApp); } catch(e) {}
        }
        console.error(error);
        throw new Error('فشل إنشاء المستخدم: ' + error.message);
    }
}

// 5. تحديث بيانات مستخدم
export async function updateUser(userId, data) {
    try {
        await updateDoc(doc(db, 'users', userId), {
            ...data,
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        throw new Error('فشل تحديث المستخدم: ' + error.message);
    }
}

// 6. إيقاف/تنشيط مستخدم
export async function toggleUserStatus(userId, newStatus) {
    try {
        await updateDoc(doc(db, 'users', userId), {
            active: newStatus,
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        throw new Error('فشل تغيير حالة المستخدم: ' + error.message);
    }
}

// 7. جلب بيانات المستخدم الحالي
export async function getCurrentUserData() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (user) {
                // تشييك السوبر ادمن
                if (user.email === SUPER_ADMIN.email) {
                    resolve({ 
                        uid: user.uid, 
                        email: user.email,
                        role: 'superadmin', 
                        name: 'السوبر ادمن',
                        projectCode: SUPER_ADMIN.code,
                        active: true
                    });
                    return;
                }
                
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

// 8. تشييك هل المستخدم سوبر ادمن
export async function isSuperAdmin() {
    const userData = await getCurrentUserData();
    return userData?.role === 'superadmin';
}

// 9. تسجيل الخروج
export async function logout() {
    await signOut(auth);
    localStorage.clear();
    window.location.href = 'index.html';
}
