import { createContext, useCallback, useContext, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hms_user')); } catch { return null; }
  });

  const login = useCallback((u, t) => {
    setUser(u);
    localStorage.setItem('hms_user', JSON.stringify(u));
    localStorage.setItem('hms_token', t);
  }, []);

  const updateUser = useCallback((next) => {
    setUser(next);
    localStorage.setItem('hms_user', JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hms_user');
    localStorage.removeItem('hms_token');
  }, []);

  return <AuthCtx.Provider value={{ user, login, logout, updateUser }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
