import { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken } from './api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('ucu_user')); } catch { return null; }
  });

  const save = ({ token, user }) => {
    setToken(token);
    sessionStorage.setItem('ucu_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const clear = () => {
    setToken(null);
    sessionStorage.removeItem('ucu_user');
    setUser(null);
  };

  // If the backend says our token is invalid/expired, sign out locally.
  useEffect(() => {
    window.addEventListener('auth:expired', clear);
    return () => window.removeEventListener('auth:expired', clear);
  }, []);

  const value = {
    user,
    login: async (email, password) => save(await api.login({ email, password })),
    register: async (data) => save(await api.register(data)),
    logout: async () => {
      try { await api.logout(); } catch { /* still log out locally */ }
      clear();
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
