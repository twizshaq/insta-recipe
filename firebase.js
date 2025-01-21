// firebase.js
import { getAuth } from "firebase/auth";
import { initializeApp, FirebaseApp } from 'firebase/app';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDhZM5bXVzk4TcNC2duJuoOvF4vxdahMEg",
    authDomain: "insta-recipe-firebase.firebaseapp.com",
    projectId: "insta-recipe-firebase",
    storageBucket: "insta-recipe-firebase.firebasestorage.app",
    messagingSenderId: "993889297177",
    appId: "1:993889297177:web:3f73cb786da44798d15b88",
    measurementId: "G-S0TJPFDGYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication

export { app, auth }; // Export both app and auth