import { createContext, useContext, useMemo } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from '../types/profile';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, profile, loading } = useSupabaseAuth();

  const value = useMemo(
    () => ({
      session,
      profile,
      loading
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
