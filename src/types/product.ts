export type CondicionProducto = 'Nuevo' | 'Casi nuevo' | 'Usado' | 'Con detalles';

export interface ProductImage {
  url: string;
  principal?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  categoria_id: string;
  categoria_nombre?: string;
  condicion: CondicionProducto;
  precio_original_usd: number;
  precio_promocional_usd: number | null;
  en_promocion: boolean;
  promo_inicio_utc: string | null;
  promo_fin_utc: string | null;
  stock: number;
  sku: string;
  imagenes: string[];
  destacado: boolean;
  activo: boolean;
  created_at_utc: string;
  updated_at_utc: string;
  tallas?: string | null;
  medidas?: string | null;
}

export interface WishlistItem {
  user_id: string;
  product_id: string;
  created_at_utc: string;
  product?: Product;
}
