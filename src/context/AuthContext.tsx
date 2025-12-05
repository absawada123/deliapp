import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Types
type AuthMode = 'real' | 'hackathon';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  authMode: AuthMode;
  isLoading: boolean;
  loginWithHackathon: (password: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hackathon Credentials from .env
const HACKATHON_USER = 'hackathon2025';
const HACKATHON_PASS = import.meta.env.VITE_HACKATHON_PASS || 'tekmakon';

// Mock User Object for Hackathon Mode
const MOCK_USER: User = {
  id: 'hackathon-admin-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'hackathon@tekmakon.com',
  phone: '',
  confirmation_sent_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'hackathon' },
  user_metadata: { name: 'Hackathon Admin', is_mock: true },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  identities: []
};

// Mock Session
const MOCK_SESSION: Session = {
  access_token: 'mock-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh',
  user: MOCK_USER
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('real');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check for real Supabase session
    const initAuth = async () => {
      try {
        // Check local storage for hackathon mode
        const isHackathon = localStorage.getItem('auth_mode') === 'hackathon';
        
        if (isHackathon) {
          setSession(MOCK_SESSION);
          setUser(MOCK_USER);
          setAuthMode('hackathon');
        } else {
          const { data: { session } } = await supabase.auth.getSession();
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Auth Init Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // 2. Listen for Supabase Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (authMode === 'real') {
        setSession(session);
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, [authMode]);

  const loginWithHackathon = (password: string) => {
    if (password === HACKATHON_PASS) {
      localStorage.setItem('auth_mode', 'hackathon');
      setAuthMode('hackathon');
      setSession(MOCK_SESSION);
      setUser(MOCK_USER);
      return true;
    }
    return false;
  };

  const signOut = async () => {
    if (authMode === 'hackathon') {
      localStorage.removeItem('auth_mode');
      setAuthMode('real');
      setSession(null);
      setUser(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, authMode, isLoading, loginWithHackathon, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
