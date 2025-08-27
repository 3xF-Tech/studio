
import { 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged as onFirebaseAuthStateChanged,
    type User
} from "firebase/auth";
import { auth } from "./config"; // Import centralized auth instance
import { getUser } from "./firestore";

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};

export const onAuthStateChanged = (callback: (user: User | null, userRole: string | null) => void) => {
    return onFirebaseAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in, get their role from Firestore.
            try {
                const userProfile = await getUser(user.uid);
                const userRole = userProfile?.role || null;
                callback(user, userRole);
            } catch (error) {
                console.error("Error fetching user role:", error);
                callback(user, null); // Proceed without role if it fails
            }
        } else {
            // User is signed out.
            callback(null, null);
        }
    });
};
