// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/auth'
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnCnac1ezjq3soWbwaszdzUx6z-tuH-t8",
  authDomain: "data-base-remember.firebaseapp.com",
  projectId: "data-base-remember",
  storageBucket: "data-base-remember.appspot.com",
  messagingSenderId: "878021353967",
  appId: "1:878021353967:web:2534094ccb8bedec3d561a",
  measurementId: "G-V268H4P4TF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);