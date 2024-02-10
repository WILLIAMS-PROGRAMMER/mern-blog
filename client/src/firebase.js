// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-blog-8b11b.firebaseapp.com",
  projectId: "mern-blog-8b11b",
  storageBucket: "mern-blog-8b11b.appspot.com",
  messagingSenderId: "795590375676",
  appId: "1:795590375676:web:035936a98a1e74822e3f79"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);