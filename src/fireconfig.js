// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZW3fA-I9OxA2Zwm3x60inL019fGCsZ_s",
  authDomain: "site-sync-5c0b9.firebaseapp.com",
  projectId: "site-sync-5c0b9",
  storageBucket: "site-sync-5c0b9.appspot.com",
  messagingSenderId: "476420287228",
  appId: "1:476420287228:web:4f702843de0d9bdb83c579",
  measurementId: "G-3CZG33YHMR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);