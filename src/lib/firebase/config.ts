
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

// Your web app's Firebase configuration that you got from the tool
// IMPORTANT: DO NOT MODIFY THIS OBJECT
const firebaseConfig = {
  "projectId": "carvalhal",
  "appId": "1:615800990371:web:457c289367a8627675ed16",
  "storageBucket": "carvalhal.firebasestorage.app",
  "apiKey": "AIzaSyD_dqVE6DHnQ04Mak5m4FTdf38ueAipI3U",
  "authDomain": "carvalhal.firebaseapp.com",
  "messagingSenderId": "615800990371",
  "measurementId": "G-5512H5E612"
};

// Initialize Firebase for SSR and ensure it's a singleton
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
