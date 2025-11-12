import React, { createContext, useState, useContext, useEffect } from 'react';
import { openDatabase, getUserById } from '../database/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initializeDb();
  }, []);

  const initializeDb = async () => {
    try {
      await openDatabase();
      setDbInitialized(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      setIsLoading(false);
    }
  };

  const login = async (userId) => {
    try {
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = async (userId) => {
    try {
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const value = {
    user,
    isLoading,
    dbInitialized,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
