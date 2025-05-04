import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
  username: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null | undefined;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUser({ username: storedUsername });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const login = (token: string, username: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setIsLoggedIn(true);
    setUser({ username });
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};