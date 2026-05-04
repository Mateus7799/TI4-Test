import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    return pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
    });
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    return authData;
  };

  const signup = async (email, password, role, name) => {
    const user = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      role,
      name,
    }, { $autoCancel: false });
    await login(email, password);
    return user;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};