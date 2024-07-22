// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
 // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY ,
  authDomain: "fyp1-659f2.firebaseapp.com",
  projectId: "fyp1-659f2",
  storageBucket: "fyp1-659f2.appspot.com",
  messagingSenderId: "394912299967",
  appId: "1:394912299967:web:b75fb2eaf0809064e6ff0a",
  measurementId: "G-FHY98RQCZ0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
 