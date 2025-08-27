import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged as onFirebaseAuthStateChanged,
    type User
} from "firebase/auth";
import { auth } from "./config"; // Import centralized auth instance

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};

// This onAuthStateChanged now only deals with the auth state, not the user profile.
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return onFirebaseAuthStateChanged(auth, callback);
};
