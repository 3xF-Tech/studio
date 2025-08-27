import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged as onFirebaseAuthStateChanged,
    type Auth,
    type User
} from "firebase/auth";

// The login function now receives the auth instance directly,
// ensuring it operates on an initialized instance provided by the AuthContext.
export const login = (auth: Auth, email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// The logout function now receives the auth instance directly.
export const logout = (auth: Auth) => {
    return signOut(auth);
};

// This function remains the same but will be called with a dynamically loaded auth instance.
export const onAuthStateChanged = (auth: Auth, callback: (user: User | null) => void) => {
    return onFirebaseAuthStateChanged(auth, callback);
};
