
import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

type UserProfile = {
  name: string;
  email: string;
  role: 'admin' | 'secretary' | 'professional' | 'finance' | 'marketing' | 'readonly';
};

// Function to get a user profile from Firestore
export const getUser = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // NOTE: This is a placeholder for actual user data.
    // In a real application, you would fetch the user's role from their profile.
    // For this prototype, we'll hardcode the admin role for the demo user.
    if (docSnap.data().email === 'admin@example.com') {
         return { ...docSnap.data(), role: 'admin' } as UserProfile;
    }
    return docSnap.data() as UserProfile;
  } else {
    // In a real app, you might want to create a default profile here
    // or handle the case where the profile doesn't exist.
    console.log("No such user profile!");

    // For the demo, if the user is admin@example.com and has no profile, create one in memory.
     if (uid === 'IqT8yS0P2rfvO1bYn2pZ3gH7E5A2') { // A hardcoded UID for demo purposes
        return {
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
        };
    }
    
    return null;
  }
};
