// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "multimodal-chat-app-898f9.firebaseapp.com",
  projectId: "multimodal-chat-app-898f9",
  storageBucket: "multimodal-chat-app-898f9.firebasestorage.app",
  messagingSenderId: "65336378431",
  appId: "1:65336378431:web:f96d1ca87439c33d8ae48a",
  measurementId: "G-F6MR1S33XW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "");
