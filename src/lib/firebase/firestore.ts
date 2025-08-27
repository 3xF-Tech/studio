
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "./config"; // Import centralized app instance

const db = getFirestore(app);

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
    console.log("No such user profile for UID:", uid);
    return null;
  }
};
