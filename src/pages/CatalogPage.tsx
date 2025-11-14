import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types/product';
import type { Category } from '../types/category';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/catalog/CategoryFilter';
import { ConditionFilter } from '../components/catalog/ConditionFilter';
import { PriceRangeFilter } from '../components/catalog/PriceRangeFilter';

const fetchProductos = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(nombre)')
    .eq('activo', true)
    .order('created_at_utc', { ascending: false });
  if (error) throw error;
  return (data || []).map((item) => ({ ...item, categoria_nombre: item.categories?.nombre })) as Product[];
};

const fetchCategorias = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('nombre', { ascending: true });
  if (error) throw error;
  const categories = data as Category[];
  const buildTree = (parentId: string | null, nivel = 0): Category[] =>
    categories
      .filter((category) => category.parent_id === parentId)
      .map((category) => ({
        ...category,
        nivel,
        children: buildTree(category.id, nivel + 1)
      }));
  return buildTree(null);
};

export const CatalogPage: React.FC = () => {
  const { data: productos, isLoading } = useQuery<Product[]>({ queryKey: ['catalogo'], queryFn: fetchProductos });
  const { data: categorias } = useQuery<Category[]>({ queryKey: ['categorias'], queryFn: fetchCategorias });
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [condicionSeleccionada, setCondicionSeleccionada] = useState<string | null>(null);
  const [orden, setOrden] = useState('recientes');
  const [rangoPrecio, setRangoPrecio] = useState<[number, number]>([0, 1000]);

  const productosFiltrados = useMemo(() => {
    if (!productos) return [];
    return productos
      .filter((producto) => {
        if (categoriaSeleccionada && producto.categoria_id !== categoriaSeleccionada) {
          return false;
        }
        if (condicionSeleccionada && producto.condicion !== condicionSeleccionada) {
          return false;
        }
        const precio = producto.en_promocion && producto.precio_promocional_usd
          ? producto.precio_promocional_usd
          : producto.precio_original_usd;
        return precio >= rangoPrecio[0] && precio <= rangoPrecio[1];
      })
      .sort((a, b) => {
        if (orden === 'precioAsc') {
          const precioA = a.en_promocion && a.precio_promocional_usd ? a.precio_promocional_usd : a.precio_original_usd;
          const precioB = b.en_promocion && b.precio_promocional_usd ? b.precio_promocional_usd : b.precio_original_usd;
          return precioA - precioB;
        }
        if (orden === 'precioDesc') {
          const precioA = a.en_promocion && a.precio_promocional_usd ? a.precio_promocional_usd : a.precio_original_usd;
          const precioB = b.en_promocion && b.precio_promocional_usd ? b.precio_promocional_usd : b.precio_original_usd;
          return precioB - precioA;
        }
        return new Date(b.created_at_utc).getTime() - new Date(a.created_at_utc).getTime();
      });
  }, [productos, categoriaSeleccionada, condicionSeleccionada, rangoPrecio, orden]);

  return (
    <div className="container-responsive py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-72">
          <div className="space-y-6 rounded-3xl border border-grisFondo bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-secondary">Filtrar por</h2>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-secondary">Categorías</h3>
              {categorias ? (
                <CategoryFilter
                  categories={categorias}
                  selected={categoriaSeleccionada}
                  onSelect={setCategoriaSeleccionada}
                />
              ) : (
                <p className="text-xs text-grisTexto">Cargando categorías…</p>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-secondary">Condición</h3>
              <ConditionFilter selected={condicionSeleccionada} onSelect={setCondicionSeleccionada} />
            </div>
            <div>
              <PriceRangeFilter min={0} max={1000} value={rangoPrecio} onChange={setRangoPrecio} />
            </div>
          </div>
        </aside>
        <section className="flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-secondary">Catálogo</h1>
              <p className="text-sm text-grisTexto">Explora todas las piezas disponibles en Second Round.</p>
            </div>
            <div>
              <label className="text-xs font-medium text-grisTexto">
                Ordenar por
                <select
                  value={orden}
                  onChange={(event) => setOrden(event.target.value)}
                  className="ml-2 rounded-full border border-grisFondo px-4 py-2 text-sm"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="precioAsc">Precio menor a mayor</option>
                  <option value="precioDesc">Precio mayor a menor</option>
                </select>
              </label>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <p className="text-sm text-grisTexto">Cargando productos…</p>
            ) : productosFiltrados.length ? (
              productosFiltrados.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <p className="text-sm text-grisTexto">No encontramos productos con los filtros seleccionados.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
