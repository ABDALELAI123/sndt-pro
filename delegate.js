// auth.js - نظام الدخول بالكود + جوال + باسورد (مصحح)
import { auth, db } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { showError, showSuccess } from './core.js';
import { t } from './lang.js';

const SUPER_ADMIN = {
    code: '001122334455',
    phone: '0597087767',
    password: '500600'
};

function generateEmail(projectCode, phone) {
    return `${projectCode.toLowerCase()}-${phone}@sndat.pro`;
}

// جلب بيانات المستخدم من المكان الصحيح
async function fetchUserData(uid) {
    let snap = await getDoc(doc(db, 'managers', uid));
    if (!snap.exists()) snap = await getDoc(doc(db, 'delegates', uid));
    if (!snap.exists()) snap = await getDoc(doc(db, 'users', uid)); // دعم قديم
    return snap.exists() ? { uid, ...snap.data() } : null;
}

export async function login(projectCode, phone, password) {
    try {
        if (projectCode === SUPER_ADMIN.code && phone === SUPER_ADMIN.phone && password === SUPER_ADMIN.password) {
            const email = generateEmail(SUPER_ADMIN.code, SUPER_ADMIN.phone);
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (e) {
                if (e.code === 'auth/user-not-found') {
                    await createSuperAdmin();
                    await signInWithEmailAndPassword(auth, email, password);
                } else throw e;
            }
            return { role: 'superadmin' };
        }

        const email = generateEmail(projectCode, phone);
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const userData = await fetchUserData(cred.user.uid);
        
        if (!userData) throw new Error('بيانات المستخدم غير موجودة');
        if (userData.projectCode !== projectCode) {
            await signOut(auth);
            throw new Error('كود المشروع غير صحيح');
        }
        return userData;
    } catch (error) {
        console.error(error);
        throw new Error(t('login_failed') + ': ' + error.message);
    }
}

async function createSuperAdmin() {
    const email = generateEmail(SUPER_ADMIN.code, SUPER_ADMIN.phone);
    const cred = await createUserWithEmailAndPassword(auth, email, SUPER_ADMIN.password);
    await setDoc(doc(db, 'managers', cred.user.uid), {
        role: 'superadmin',
        phone: SUPER_ADMIN.phone,
        projectCode: SUPER_ADMIN.code,
        name: 'المدير العام',
        createdAt: new Date()
    });
}

export async function createUser(projectCode, phone, password, role, name, managerId = null) {
    try {
        const col = role === 'manager' ? 'managers' : 'delegates';
        const q = query(collection(db, col), where('projectCode', '==', projectCode), where('phone', '==', phone));
        const exists = await getDocs(q);
        if (!exists.empty) throw new Error('رقم الجوال مسجل مسبقاً');

        const email = generateEmail(projectCode, phone);
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        
        const data = {
            role,
            phone,
            projectCode,
            name,
            createdAt: new Date()
        };
        if (role === 'delegate') {
            data.managerId = managerId || projectCode; // مهم للحفظ
            data.permissions = { add_bond: true, view_own_bonds: true };
        } else {
            data.permissions = { add_delegate: true, view_reports: true, edit_bonds: true };
        }
        
        await setDoc(doc(db, col, cred.user.uid), data);
        return { success: true, uid: cred.user.uid };
    } catch (error) {
        console.error(error);
        throw new Error('فشل إنشاء المستخدم: ' + error.message);
    }
}

export async function getCurrentUserData() {
    const user = auth.currentUser;
    if (!user) return null;
    return await fetchUserData(user.uid);
}

export async function isSuperAdmin() {
    const data = await getCurrentUserData();
    return data?.role === 'superadmin';
}

export async function logout() {
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
}
