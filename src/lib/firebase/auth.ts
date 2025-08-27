import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged as onFirebaseAuthStateChanged,
    type User,
    type Auth
} from "firebase/auth";
import { auth } from "./config"; // Import centralized auth instance

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};

// This onAuthStateChanged now takes the auth instance as a parameter to ensure it's initialized.
export const onAuthStateChanged = (authInstance: Auth, callback: (user: User | null) => void) => {
    return onFirebaseAuthStateChanged(authInstance, callback);
};
