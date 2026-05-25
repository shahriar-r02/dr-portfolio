import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyC1l4lgfx73vHaJAtsEIp6WxPx594wQrVI",
    authDomain: "dr-portfolio-d682d.firebaseapp.com",
    projectId: "dr-portfolio-d682d",
    storageBucket: "dr-portfolio-d682d.firebasestorage.app",
    messagingSenderId: "253656234722",
    appId: "1:253656234722:web:9f5f067bee957393f13cbb"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()