import { createContext, useContext, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hms_user')); } catch { return null; }
  });

  const login = (u, t) => {
    setUser(u);
    localStorage.setItem('hms_user', JSON.stringify(u));
    localStorage.setItem('hms_token', t);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_user');
    localStorage.removeItem('hms_token');
  };

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);