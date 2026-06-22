// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration - قيم مشروعك الحقيقية
const firebaseConfig = {
  apiKey: "AIzaSyBvEU1Cmt1IX4h0xaCd6Mca0MufvGqr2fY",
  authDomain: "sanadat-pro.firebaseapp.com",
  projectId: "sanadat-pro",
  storageBucket: "sanadat-pro.firebasestorage.app",
  messagingSenderId: "1039476751095",
  appId: "1:1039476751095:web:f2a7744d6469385e7771f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
