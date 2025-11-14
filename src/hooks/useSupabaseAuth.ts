import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../types/profile';

export const useSupabaseAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerSesion = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await cargarPerfil(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    const cargarPerfil = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!error) {
        setProfile(data as Profile);
      }
    };

    obtenerSesion();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await cargarPerfil(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, profile, loading } as const;
};
