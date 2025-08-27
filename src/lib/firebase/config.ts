
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration that you got from the tool
// IMPORTANT: DO NOT MODIFY THIS OBJECT
const firebaseConfig = {
  "apiKey": "xxxx",
  "authDomain": "xxxx",
  "projectId": "xxxx",
  "storageBucket": "xxxx",
  "messagingSenderId": "xxxx",
  "appId": "xxxx"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { app, db };
