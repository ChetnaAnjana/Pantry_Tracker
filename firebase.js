// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ2egDGRDVLm_kAzm3qeCazgG_sCOOvV0",
  authDomain: "hspantryapp-baecf.firebaseapp.com",
  projectId: "hspantryapp-baecf",
  storageBucket: "hspantryapp-baecf.appspot.com",
  messagingSenderId: "72796561830",
  appId: "1:72796561830:web:00fff1233136b94059ef67",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firebaseConfig };

//const firestore  = getFirestore(app);
// import {FireStore} from 'firebase/firestore';
