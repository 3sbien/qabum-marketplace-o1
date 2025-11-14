import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { WishlistItem } from '../types/product';
import { useAuth } from './AuthContext';

interface WishlistContextValue {
  favoritos: WishlistItem[];
  loading: boolean;
  toggleFavorito: (productId: string) => Promise<void>;
  estaEnFavoritos: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [favoritos, setFavoritos] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarFavoritos = async () => {
      if (!session?.user) {
        setFavoritos([]);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from('wishlists')
        .select('*, products(*)')
        .eq('user_id', session.user.id);
      setFavoritos(
        (data || []).map((item) => ({
          user_id: item.user_id,
          product_id: item.product_id,
          created_at_utc: item.created_at_utc,
          product: item.products
        }))
      );
      setLoading(false);
    };

    cargarFavoritos();
  }, [session?.user?.id]);

  const toggleFavorito = async (productId: string) => {
    if (!session?.user) return;
    const existe = favoritos.some((item) => item.product_id === productId);
    if (existe) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', productId);
      setFavoritos((prev) => prev.filter((item) => item.product_id !== productId));
    } else {
      const { error } = await supabase.from('wishlists').insert({
        user_id: session.user.id,
        product_id: productId
      });
      if (!error) {
        setFavoritos((prev) => [
          ...prev,
          { user_id: session.user.id, product_id: productId, created_at_utc: new Date().toISOString() }
        ]);
      }
    }
  };

  const estaEnFavoritos = (productId: string) => favoritos.some((item) => item.product_id === productId);

  return (
    <WishlistContext.Provider value={{ favoritos, loading, toggleFavorito, estaEnFavoritos }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe usarse dentro de un WishlistProvider');
  }
  return context;
};
