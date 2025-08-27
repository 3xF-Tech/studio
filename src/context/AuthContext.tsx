
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebase } from "@/lib/firebase/client";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authReady: boolean; // garante que auth/db existem
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ user, loading, authReady }, setState] = useState({
    user: null as User | null,
    loading: true,
    authReady: false,
  });

  // Inicializa somente no cliente após primeira render
  useEffect(() => {
    const { auth } = getFirebase();
    if (!auth) {
      setState((s) => ({ ...s, loading: false, authReady: false }));
      return;
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setState({ user: u, loading: false, authReady: true });
    });

    return () => unsub();
  }, []);

  const value = useMemo<AuthCtx>(() => {
    return {
      user,
      loading,
      authReady,
      async login(email: string, password: string) {
        const { auth } = getFirebase();
        if (!auth) throw new Error("Auth não está pronto no cliente.");
        await signInWithEmailAndPassword(auth, email, password);
      },
      async logout() {
        const { auth } = getFirebase();
        if (!auth) return;
        await signOut(auth);
      },
    };
  }, [user, loading, authReady]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  return ctx;
}
