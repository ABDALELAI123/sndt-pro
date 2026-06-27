// auth.js - مصحح
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const SUPER_ADMIN = { code: '001122334455', phone: '0597087767', password: '500600' };
function generateEmail(c,p){ return `${c.toLowerCase()}-${p}@sndat.pro`; }

async function fetchUserData(uid){
    let s = await getDoc(doc(db, 'managers', uid));
    if(!s.exists()) s = await getDoc(doc(db, 'delegates', uid));
    if(!s.exists()) s = await getDoc(doc(db, 'users', uid));
    return s.exists() ? {uid, ...s.data()} : null;
}

export async function getCurrentUserData(){
    return new Promise((resolve)=>{
        const unsub = onAuthStateChanged(auth, async (user)=>{
            unsub();
            if(!user) return resolve(null);
            resolve(await fetchUserData(user.uid));
        });
    });
}

export async function login(projectCode, phone, password){
    const email = generateEmail(projectCode, phone);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const data = await fetchUserData(cred.user.uid);
    if(!data || data.projectCode !== projectCode){ await signOut(auth); throw new Error('كود المشروع غير صحيح'); }
    return data;
}

export async function logout(){
    await signOut(auth);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// باقي الدوال createUser و createSuperAdmin نفس النسخة السابقة
export async function createUser(projectCode, phone, password, role, name, managerId=null){
    const col = role==='manager'?'managers':'delegates';
    const email = generateEmail(projectCode, phone);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const data = { role, phone, projectCode, name, createdAt: new Date() };
    if(role==='delegate') data.managerId = managerId || projectCode;
    await setDoc(doc(db, col, cred.user.uid), data);
    return {success:true};
}
