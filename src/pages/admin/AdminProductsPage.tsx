import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Product } from '../../types/product';
import { formatearPrecio } from '../../utils/format';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').order('created_at_utc', { ascending: false });
      setProducts((data || []) as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">Productos</h1>
          <p className="text-sm text-grisTexto">Gestiona el inventario disponible en la tienda.</p>
        </div>
        <button className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white">
          Nuevo producto
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-grisFondo text-sm">
          <thead className="bg-grisFondo">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs text-grisTexto">Producto</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs text-grisTexto">Precio</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs text-grisTexto">Stock</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-xs text-grisTexto">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-grisFondo">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-grisTexto">
                  Cargando productos…
                </td>
              </tr>
            ) : products.length ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imagenes?.[0] || '/placeholder-product.svg'}
                        alt={product.nombre}
                        className="h-12 w-12 rounded-2xl object-cover"
                      />
                      <div>
                        <p className="font-semibold text-secondary">{product.nombre}</p>
                        <p className="text-xs text-grisTexto">{product.condicion}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatearPrecio(product.precio_original_usd)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.activo ? 'bg-primary/60' : 'bg-grisFondo'}`}>
                      {product.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-sm font-semibold text-secondary underline">Editar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-grisTexto">
                  Aún no hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
