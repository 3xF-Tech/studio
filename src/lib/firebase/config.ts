// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration that you got from the tool
// IMPORTANT: DO NOT MODIFY THIS OBJECT
const firebaseConfig = {
  "projectId": "carvalhal",
  "appId": "1:615800990371:web:457c289367a8627675ed16",
  "storageBucket": "carvalhal.firebasestorage.app",
  "apiKey": "AIzaSyD_dqVE6DHnQ04Mak5m4FTdf38ueAipI3U",
  "authDomain": "carvalhal.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "615800990371"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
