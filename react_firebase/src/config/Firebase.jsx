// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCBLNtiA70gvZPOj7ER914eUIpmTDZpthw",
    authDomain: "fir-react-fedb4.firebaseapp.com",
    projectId: "fir-react-fedb4",
    storageBucket: "fir-react-fedb4.appspot.com",
    messagingSenderId: "25848748739",
    appId: "1:25848748739:web:326e5d287cd760c238e076",
    measurementId: "G-XXTXSSKGTJ"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);