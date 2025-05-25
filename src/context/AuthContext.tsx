import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  academyName?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('academy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Check for active Supabase session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        // Get user data from Supabase
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData && !userError) {
          const authUser: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role || 'member',
            academyName: userData.academy_name
          };
          
          setUser(authUser);
          localStorage.setItem('academy_user', JSON.stringify(authUser));
        }
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Get user data from Supabase
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData && !userError) {
          const authUser: User = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role || 'member',
            academyName: userData.academy_name
          };
          
          setUser(authUser);
          localStorage.setItem('academy_user', JSON.stringify(authUser));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('academy_user');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // For demo purposes, allow login with any credentials
        if (process.env.NODE_ENV === 'development') {
          const mockUser: User = {
            id: '1',
            name: 'Gestora Academia',
            email,
            role: 'admin',
            academyName: 'Academia Força Local'
          };
          
          setUser(mockUser);
          localStorage.setItem('academy_user', JSON.stringify(mockUser));
          navigate('/dashboard');
          return;
        }
        
        throw error;
      }
      
      // Get user data from Supabase
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userError) throw userError;
        
        const authUser: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role || 'member',
          academyName: userData.academy_name
        };
        
        setUser(authUser);
        localStorage.setItem('academy_user', JSON.stringify(authUser));
        
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem('onboarding_completed') === 'true';
        
        if (!hasCompletedOnboarding && authUser.role === 'admin') {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create user record in the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email,
              name,
              role: 'admin', // First user is admin
              academy_name: 'Minha Academia', // Default name
              status: 'Ativo'
            }
          ])
          .select();
        
        if (userError) throw userError;
        
        const authUser: User = {
          id: userData[0].id,
          name: userData[0].name,
          email: userData[0].email,
          role: userData[0].role,
          academyName: userData[0].academy_name
        };
        
        setUser(authUser);
        localStorage.setItem('academy_user', JSON.stringify(authUser));
        
        // Redirect to onboarding
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('academy_user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      isAuthenticated: !!user,
      register,
      resetPassword
    }}>
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