**لقيت السبب! الإيميل مقلوب** 😱

شوف السطر في الكونسول:
```
محاولة دخول بالإيميل: 0597087767-001122334455@sanadat.pro
```

**المفروض يكون:**
```
001122334455-0597087767@sanadat.pro
```

**الغلط:** عكست بين الجوال والكود في دالة `generateEmail`

// auth.js - نسخة مصححة نهائياً
import { auth, db } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// بيانات السوبر ادمن الثابتة
const SUPER_ADMIN = {
    code: '001122334455',
    phone: '0597087767',
    password: '500600'
};

// 1. تحويل كود+جوال لايميل وهمي - الترتيب الصح: كود-جوال
function generateEmail(projectCode, phone) {
    return `${projectCode.toLowerCase()}-${phone}@sanadat.pro`;
}

// 2. تسجيل الدخول
export async function login(projectCode, phone, password) {
    try {
        const email = generateEmail(projectCode, phone);
        console.log('محاولة دخول بالإيميل:', email);
        
        // تشييك السوبر ادمن
        if (projectCode === SUPER_ADMIN.code && phone === SUPER_ADMIN.phone && password === SUPER_ADMIN.password) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('تم دخول السوبر ادمن');
                return { role: 'superadmin', projectCode: SUPER_ADMIN.code };
            } catch (error) {
                // لو أول مرة، ننشئ حساب السوبر
                if (error.code === 'auth/user-not-found') {
                    console.log('إنشاء حساب السوبر ادمن لأول مرة');
                    await createSuperAdmin();
                    await signInWithEmailAndPassword(auth, email, password);
                    return { role: 'superadmin', projectCode: SUPER_ADMIN.code };
                } else {
                    throw error;
                }
            }
        }

        // تسجيل دخول عادي
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

// 3. إنشاء حساب السوبر ادمن أول مرة
async function createSuperAdmin() {
    const email = generateEmail(SUPER_ADMIN.code, SUPER_ADMIN.phone);
    const userCredential = await createUserWithEmailAndPassword(auth, email, SUPER_ADMIN.password);
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
        role: 'superadmin',
        phone: SUPER_ADMIN.phone,
        projectCode: SUPER_ADMIN.code,
        name: 'المدير العام',
        email: email,
        active: true,
        createdAt: new Date()
    });
    console.log('تم إنشاء السوبر ادمن بنجاح');
}

// 4. إنشاء مشروع جديد
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

// 5. إنشاء حساب مدير أو مندوب
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

// 6. جلب بيانات المستخدم الحالي
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

// 7. تشييك هل المستخدم سوبر ادمن
export async function isSuperAdmin() {
    const userData = await getCurrentUserData();
    return userData?.role === 'superadmin';
}

// 8. تسجيل الخروج
export async function logout() {
    await signOut(auth);
    localStorage.clear();
    window.location.href = 'index.html';
}
