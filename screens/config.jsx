// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { initializeApp } from "firebase/app";
import 'firebase/auth'
import { getStorage } from 'firebase/storage'
//import { getAnalytics } from "firebase/analytics";
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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {app, firebase, db, storage};
