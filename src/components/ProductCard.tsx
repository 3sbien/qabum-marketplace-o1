import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { calcularDescuento, formatearPrecio } from '../utils/format';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const precioPromo = product.en_promocion ? product.precio_promocional_usd : null;
  const descuento = precioPromo ? calcularDescuento(product.precio_original_usd, precioPromo) : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-grisFondo bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link to={`/producto/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <img
          src={product.imagenes?.[0] || '/placeholder-product.svg'}
          alt={product.nombre}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.destacado && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white">
            Destacado
          </span>
        )}
        {descuento > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-secondary">
            -{descuento}%
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-grisTexto">{product.condicion}</p>
          <h3 className="mt-1 text-base font-semibold text-secondary">
            <Link to={`/producto/${product.slug}`}>{product.nombre}</Link>
          </h3>
        </div>
        <div className="mt-auto">
          <p className="text-sm font-semibold text-secondary">{formatearPrecio(precioPromo || product.precio_original_usd)}</p>
          {precioPromo && (
            <p className="text-xs text-grisTexto line-through">{formatearPrecio(product.precio_original_usd)}</p>
          )}
        </div>
      </div>
    </article>
  );
};
