
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, type Auth } from 'firebase/auth';
import { onAuthStateChanged } from './auth.ts';
import { getUser } from './firestore';
import { type Firestore } from 'firebase/firestore';

type AuthContextType = {
  user: User | null;
  userRole: string | null;
  auth: Auth | null; // Make auth instance available in context
  db: Firestore | null; // Make db instance available in context
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  auth: null,
  db: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeFirebase = async () => {
      // Dynamically import Firebase modules only on the client-side
      const { initializeApp, getApps, getApp } = await import('firebase/app');
      const { getAuth } = await import('firebase/auth');
      const { getFirestore } = await import('firebase/firestore');

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);

      setAuth(authInstance);
      setDb(dbInstance);

      // Set up the auth state listener
      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        setUser(user);
        if (user) {
          // Special case for demo admin user remains
          if (user.uid === 'IqT8yS0P2rfvO1bYn2pZ3gH7E5A2') {
              setUserRole('admin');
          } else {
              const userProfile = await getUser(dbInstance, user.uid);
              setUserRole(userProfile?.role || null);
          }
        } else {
          setUserRole(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    initializeFirebase();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRole, auth, db, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
