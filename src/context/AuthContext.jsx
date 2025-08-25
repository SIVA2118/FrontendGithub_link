import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    try {
  
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
    } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = { token, user, login, logout, API_BASE };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);
