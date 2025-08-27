import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged as onFirebaseAuthStateChanged,
    getAuth,
    type User
} from "firebase/auth";
import { app } from "./config"; // Import the initialized app

// Get the auth instance from the initialized app
const auth = getAuth(app);

// Login now uses the guaranteed initialized auth instance
export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};

// onAuthStateChanged now takes the auth instance as a parameter to ensure it's initialized correctly.
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return onFirebaseAuthStateChanged(auth, callback);
};
