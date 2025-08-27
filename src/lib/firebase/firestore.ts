
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
    // Return the user data from firestore
    return docSnap.data() as UserProfile;
  } else {
    // This is a special case for the demo user, which may not exist in Firestore.
    // The UID 'IqT8yS0P2rfvO1bYn2pZ3gH7E5A2' corresponds to 'admin@example.com'.
    if (uid === 'IqT8yS0P2rfvO1bYn2pZ3gH7E5A2') { 
        return {
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
        };
    }
    
    console.log("No such user profile!");
    return null;
  }
};
