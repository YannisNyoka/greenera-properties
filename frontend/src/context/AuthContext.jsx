import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginApi, logout as logoutApi, register as registerApi } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  useEffect(() => {
    // On every page load, ask the backend "who am I?" using the httpOnly cookie.
    // This is the ONLY source of truth for auth state — nothing is read from storage.
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const register = async (name, email, password) => {
  const data = await registerApi(name, email, password);
  setUser(data.user);
  return data.user;
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}