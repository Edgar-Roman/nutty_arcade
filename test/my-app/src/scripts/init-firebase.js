// Import Firebase
import firebase from "firebase/compat/app";

// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, 
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         onAuthStateChanged } from "firebase/auth";
import { getFirestore, 
         collection, 
         query, 
         where, 
         getDocs, 
         setDoc, 
         doc, 
         increment, 
         updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABnF5UlnS7MNP3TBE2r1LZ6FEh_PizbFs",
  authDomain: "nutty-arcade-4bcf9.firebaseapp.com",
  projectId: "nutty-arcade-4bcf9",
  storageBucket: "nutty-arcade-4bcf9.appspot.com",
  messagingSenderId: "1076210125262",
  appId: "1:1076210125262:web:2c17f911ac1de9b91d839f",
  measurementId: "G-J5E2RP1V7F"
};

// Initialize Firebase Application
const app = firebase.initializeApp(firebaseConfig);

// Initialize Authentication Module
// const auth = getAuth(app);
const auth = getAuth(app);

// Initialize Firestore Module
const firestore = getFirestore(app);

// Initialize Analytics Module
const analytics = getAnalytics(app);

console.log("Firebase Sucessfully Initialized");

export { app,
         auth,
         firestore, 
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         onAuthStateChanged,
         collection,
         query,
         where,
         getDocs,
         setDoc,
         doc,
         increment,
         updateDoc };
