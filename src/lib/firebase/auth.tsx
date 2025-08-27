
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from 'firebase/auth';
import { onAuthStateChanged } from './auth.ts';
import { getUser } from './firestore'; // Import getUser here

type AuthContextType = {
  user: User | null;
  userRole: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect handles fetching the user role AFTER the user object is available.
    const fetchUserRole = async (user: User) => {
      // Special case for demo user
      if (user.uid === 'IqT8yS0P2rfvO1bYn2pZ3gH7E5A2') {
        setUserRole('admin');
        setLoading(false);
        return;
      }
      try {
        const userProfile = await getUser(user.uid);
        setUserRole(userProfile?.role || null);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null); // Proceed without a role if fetching fails
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // If user is logged in, fetch their role
        fetchUserRole(user);
      } else {
        // If user is logged out, clear role and stop loading
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
