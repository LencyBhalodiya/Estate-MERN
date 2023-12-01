// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "react-estate-cfb9f.firebaseapp.com",
  projectId: "react-estate-cfb9f",
  storageBucket: "react-estate-cfb9f.appspot.com",
  messagingSenderId: "978464893885",
  appId: "1:978464893885:web:c676fc52ae96001b4200d4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);