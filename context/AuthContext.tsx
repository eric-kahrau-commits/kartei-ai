'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from 'firebase/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only import Firebase on client side
    let unsubscribe: () => void;
    import('firebase/auth').then(({ onAuthStateChanged, getAuth }) => {
      import('@/lib/firebase/config').then(({ getFirebaseApp }) => {
        const auth = getAuth(getFirebaseApp());
        unsubscribe = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
      });
    });
    return () => { unsubscribe?.(); };
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
