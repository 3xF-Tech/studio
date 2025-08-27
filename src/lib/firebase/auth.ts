import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged as onFirebaseAuthStateChanged,
    type User,
    type Auth
} from "firebase/auth";
import { app } from "./config"; // Import the initialized app
import { getAuth } from "firebase/auth";

// Login now ensures it gets a fresh auth instance from the app
export const login = (email, password) => {
    const auth = getAuth(app);
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    const auth = getAuth(app);
    return signOut(auth);
};

// onAuthStateChanged now takes the auth instance as a parameter to ensure it's initialized correctly.
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    const auth = getAuth(app);
    return onFirebaseAuthStateChanged(auth, callback);
};
