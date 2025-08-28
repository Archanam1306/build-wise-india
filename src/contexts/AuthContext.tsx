import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on component mount
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedAuth = localStorage.getItem('isAuthenticated');
        
        console.log('Initializing auth - savedUser:', savedUser, 'savedAuth:', savedAuth);
        
        if (savedUser && savedAuth === 'true') {
          const parsedUser = JSON.parse(savedUser);
          setUserState(parsedUser);
          setIsAuthenticated(true);
          console.log('Restored user session:', parsedUser);
        } else {
          setUserState(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setUserState(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setUser = useCallback((userData: User | null) => {
    console.log('AuthContext setUser called with:', userData);
    
    if (userData) {
      setUserState(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      console.log('User set successfully, localStorage updated');
    } else {
      setUserState(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      console.log('User cleared, localStorage cleaned');
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logout called');
    setUserState(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }, []);

  const contextValue = {
    user,
    isAuthenticated,
    setUser,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

