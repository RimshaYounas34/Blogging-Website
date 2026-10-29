// Import the functions you need from the SDKs you need
import {getAuth, GoogleAuthProvider} from'firebase/auth'
import { initializeApp } from "firebase/app";
import { getEvn } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEvn('VITE_FIREBASE_API'),
  authDomain: "yt-mern-blog-10a40.firebaseapp.com",
  projectId: "yt-mern-blog-10a40",
  storageBucket: "yt-mern-blog-10a40.firebasestorage.app",
  messagingSenderId: "633271731846",
  appId: "1:633271731846:web:9e79757f6bc5185416b307"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth , provider }