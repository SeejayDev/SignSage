// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADdgYICeIQ3j1T_eKEyUl0Hu8VUtuxVT4",
  authDomain: "signsage-1e06b.firebaseapp.com",
  projectId: "signsage-1e06b",
  storageBucket: "signsage-1e06b.appspot.com",
  messagingSenderId: "702059383831",
  appId: "1:702059383831:web:8b5801d736716909cba052"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);