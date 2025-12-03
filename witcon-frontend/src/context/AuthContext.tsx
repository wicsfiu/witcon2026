import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getAccessToken, setTokens, clearTokens } from '../utils/api';

interface AuthContextType {
  userId: number | null;
  userEmail: string | null;
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string, id: number, email?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_ID_KEY = 'witcon_user_id';
const USER_EMAIL_KEY = 'witcon_user_email';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Load userId and email from localStorage on mount
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem(USER_ID_KEY);
    return stored ? parseInt(stored, 10) : null;
  });
  
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem(USER_EMAIL_KEY);
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return getAccessToken();
  });

  // Persist userId and email to localStorage whenever they change
  useEffect(() => {
    if (userId !== null) {
      localStorage.setItem(USER_ID_KEY, userId.toString());
    } else {
      localStorage.removeItem(USER_ID_KEY);
    }
  }, [userId]);

  useEffect(() => {
    if (userEmail !== null) {
      localStorage.setItem(USER_EMAIL_KEY, userEmail);
    } else {
      localStorage.removeItem(USER_EMAIL_KEY);
    }
  }, [userEmail]);

  // Update accessToken state when localStorage changes
  useEffect(() => {
    const token = getAccessToken();
    setAccessToken(token);
  }, []);

  const login = (accessToken: string, refreshToken: string, id: number, email?: string) => {
    setTokens(accessToken, refreshToken);
    setAccessToken(accessToken);
    setUserId(id);
    if (email) {
      setUserEmail(email);
    }
  };
  
  const logout = () => {
    clearTokens();
    setAccessToken(null);
    setUserId(null);
    setUserEmail(null);
  };

  const isAuthenticated = !!accessToken && !!userId;

  return (
    <AuthContext.Provider value={{ userId, userEmail, accessToken, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
