'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name?: string;
  email: string;
  loggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoading(true);
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('reviewmaster-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.loggedIn) {
          setUser(parsedUser);
        }
      } catch (e) {
        localStorage.removeItem('reviewmaster-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData: User = { email, loggedIn: true };
        localStorage.setItem('reviewmaster-user', JSON.stringify(userData));
        setUser(userData);
        resolve(true);
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData: User = { name, email, loggedIn: true };
        localStorage.setItem('reviewmaster-user', JSON.stringify(userData));
        setUser(userData);
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('reviewmaster-user');
    setUser(null);
    window.location.assign('/');
  };

  if (mounted && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
