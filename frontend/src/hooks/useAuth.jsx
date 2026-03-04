import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { celebrateWithFlowers } from '../utils/celebrate';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isNewLogin = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Verify domain
        if (firebaseUser.email?.endsWith('@fiftyflowers.com')) {
          setUser(firebaseUser);
          setError(null);
          // Trigger celebration only on fresh login, not page refresh
          if (isNewLogin.current) {
            celebrateWithFlowers(50);
            isNewLogin.current = false;
          }
        } else {
          // Sign out if not from allowed domain
          signOut(auth);
          setError('Access restricted to @fiftyflowers.com accounts');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setError(null);
      isNewLogin.current = true;
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message);
      isNewLogin.current = false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
