import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAuth, registerAuth } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nextstep_user'));
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user
      ? localStorage.setItem('nextstep_user', JSON.stringify(user))
      : localStorage.removeItem('nextstep_user');
  }, [user]);

  async function signIn(email, senha) {
    setLoading(true);
    try {
      const loggedUser = await loginAuth({ email, senha });
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  }

  async function registerUser(nome, email, senha, role) {
    setLoading(true);
    try {
      const createdUser = await registerAuth({ nome, email, senha, role });
      setUser(createdUser);
      return createdUser;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}