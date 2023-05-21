// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHvMahG5qd2dkmFc8orqgOYyk6aUF1J4s",
  authDomain: "chat-application-bfe82.firebaseapp.com",
  projectId: "chat-application-bfe82",
  storageBucket: "chat-application-bfe82.appspot.com",
  messagingSenderId: "714732310830",
  appId: "1:714732310830:web:ee5167b737d83aa5beaabf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
