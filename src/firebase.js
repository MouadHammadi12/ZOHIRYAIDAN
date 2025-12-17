// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// NOTE: apiKey jay mn environment variable bach ma ybqach maktoub direct f code
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "zohirzaidan-c8ab4.firebaseapp.com",
  projectId: "zohirzaidan-c8ab4",
  storageBucket: "zohirzaidan-c8ab4.firebasestorage.app",
  messagingSenderId: "484410612498",
  appId: "1:484410612498:web:a3e753585eed598ad2b1cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);