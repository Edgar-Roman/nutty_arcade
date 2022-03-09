// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import { getFirestore, collection, query, where, getDocs, setDoc, doc} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";


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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

console.log("Firebase Successfully Initialized.")

export { app, auth, firestore, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, collection, query, where, getDocs, setDoc, doc };
