import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types/product';
import { formatearPrecio, calcularDescuento } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toggleFavorito, estaEnFavoritos } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (!error) {
        setProduct(data as Product);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-responsive py-16">
        <p className="text-sm text-grisTexto">Cargando producto…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-responsive py-16">
        <p className="text-sm text-grisTexto">No encontramos este producto. Tal vez ya fue vendido.</p>
      </div>
    );
  }

  const precioPromo = product.en_promocion ? product.precio_promocional_usd : null;
  const descuento = precioPromo ? calcularDescuento(product.precio_original_usd, precioPromo) : 0;

  return (
    <div className="container-responsive py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-3xl bg-grisFondo">
            <img src={product.imagenes?.[0] || '/placeholder-product.svg'} alt={product.nombre} className="h-full w-full object-cover" />
          </div>
          {product.imagenes?.length ? (
            <div className="flex gap-2 overflow-x-auto">
              {product.imagenes.map((imagen) => (
                <img key={imagen} src={imagen} alt={product.nombre} className="h-20 w-20 rounded-2xl object-cover" />
              ))}
            </div>
          ) : null}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-grisTexto">{product.condicion}</p>
            <h1 className="mt-2 text-3xl font-semibold text-secondary">{product.nombre}</h1>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-secondary">
                {formatearPrecio(precioPromo || product.precio_original_usd)}
              </span>
              {precioPromo && (
                <span className="text-sm text-grisTexto line-through">{formatearPrecio(product.precio_original_usd)}</span>
              )}
              {descuento > 0 && <span className="rounded-full bg-primary/60 px-3 py-1 text-xs font-semibold">-{descuento}%</span>}
            </div>
            <p className="text-sm text-grisTexto">SKU: {product.sku}</p>
            <p className="text-sm text-grisTexto">Stock disponible: {product.stock}</p>
          </div>
          {product.tallas && (
            <div>
              <h3 className="text-sm font-semibold text-secondary">Tallas o medidas</h3>
              <p className="text-sm text-grisTexto">{product.tallas}</p>
            </div>
          )}
          <p className="text-sm text-secondary">{product.descripcion}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => addItem(product, 1)}
              className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90"
            >
              Agregar al carrito
            </button>
            <button
              type="button"
              onClick={() => toggleFavorito(product.id)}
              className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${
                estaEnFavoritos(product.id)
                  ? 'border-secondary bg-secondary text-white'
                  : 'border-secondary text-secondary hover:bg-primary/40'
              }`}
            >
              {estaEnFavoritos(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
