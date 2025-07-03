import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AdminUser, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    sessionExpiry: null,
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            sessionExpiry: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          });
        } else {
          // Try to refresh token
          const tokens = await authService.refreshToken();
          if (tokens) {
            const refreshedUser = authService.getCurrentUser();
            if (refreshedUser) {
              setAuthState({
                user: refreshedUser,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                sessionExpiry: new Date(Date.now() + 30 * 60 * 1000),
              });
              return;
            }
          }
          
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            sessionExpiry: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize authentication',
          sessionExpiry: null,
        });
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.sessionExpiry) return;

    const refreshInterval = setInterval(async () => {
      const timeUntilExpiry = authState.sessionExpiry!.getTime() - Date.now();
      
      // Refresh token 5 minutes before expiry
      if (timeUntilExpiry <= 5 * 60 * 1000) {
        try {
          const tokens = await authService.refreshToken();
          if (tokens) {
            const user = authService.getCurrentUser();
            if (user) {
              setAuthState(prev => ({
                ...prev,
                user,
                sessionExpiry: new Date(Date.now() + 30 * 60 * 1000),
              }));
            }
          } else {
            // Refresh failed, logout user
            logout();
          }
        } catch (error) {
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(refreshInterval);
  }, [authState.isAuthenticated, authState.sessionExpiry]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user, tokens } = await authService.login(credentials);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionExpiry: new Date(Date.now() + 30 * 60 * 1000),
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user, tokens } = await authService.register(data);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionExpiry: new Date(Date.now() + 30 * 60 * 1000),
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      sessionExpiry: null,
    });
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!authState.user) throw new Error('No user logged in');

    try {
      const updatedUser = await authService.updateProfile(authState.user.id, updates);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!authState.user) throw new Error('No user logged in');

    try {
      await authService.changePassword(authState.user.id, currentPassword, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const tokens = await authService.refreshToken();
      if (tokens) {
        const user = authService.getCurrentUser();
        if (user) {
          setAuthState(prev => ({
            ...prev,
            user,
            sessionExpiry: new Date(Date.now() + 30 * 60 * 1000),
          }));
        }
      }
    } catch (error) {
      logout();
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};