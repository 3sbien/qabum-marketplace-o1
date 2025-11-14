import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types/product';
import { ProductCard } from '../components/ProductCard';

const fetchDestacados = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('destacado', true)
    .eq('activo', true)
    .order('updated_at_utc', { ascending: false })
    .limit(8);
  if (error) throw error;
  return data as Product[];
};

export const HomePage: React.FC = () => {
  const { data: productosDestacados } = useQuery<Product[]>({ queryKey: ['productosDestacados'], queryFn: fetchDestacados });

  return (
    <div>
      <section className="container-responsive grid gap-8 py-12 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-primary/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-secondary">
            Segunda mano, primera opción
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
            Reestrena piezas únicas con Second Round
          </h1>
          <p className="text-base text-grisTexto">
            Curamos ropa y accesorios de segunda mano en excelente estado. Compra piezas únicas, apoya a la economía
            circular y dale un respiro al planeta.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalogo"
              className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90"
            >
              Ver catálogo
            </Link>
            <Link
              to="/sostenibilidad"
              className="rounded-full border border-secondary px-6 py-3 text-sm font-semibold text-secondary transition hover:bg-primary/40"
            >
              Conoce nuestra filosofía
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {productosDestacados?.slice(0, 4).map((producto) => (
            <div key={producto.id} className="rounded-3xl bg-grisFondo p-4">
              <img src={producto.imagenes?.[0] || '/placeholder-product.svg'} alt={producto.nombre} className="rounded-2xl" />
              <p className="mt-2 text-sm font-medium text-secondary">{producto.nombre}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-grisFondo py-12">
        <div className="container-responsive">
          <h2 className="text-2xl font-semibold text-secondary">¿Cómo funciona Second Round?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                titulo: 'Elige tus favoritos',
                descripcion: 'Explora el catálogo y selecciona las piezas que más te gusten.'
              },
              {
                titulo: 'Confirma tu pedido',
                descripcion: 'Completa tus datos y selecciona envío a domicilio o retiro en tienda.'
              },
              {
                titulo: 'Realiza la transferencia',
                descripcion: 'Usa nuestros datos bancarios y coloca tu código de pedido como referencia.'
              },
              {
                titulo: 'Sube tu comprobante',
                descripcion: 'Carga la imagen del comprobante y te confirmaremos cuando esté aprobado.'
              }
            ].map((paso) => (
              <div key={paso.titulo} className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-secondary">{paso.titulo}</h3>
                <p className="mt-2 text-sm text-grisTexto">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-responsive py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-secondary">Piezas destacadas</h2>
          <Link to="/catalogo" className="text-sm font-semibold text-secondary underline">
            Ver todo el catálogo
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productosDestacados?.map((product) => <ProductCard key={product.id} product={product} />) || (
            <p className="text-sm text-grisTexto">Aún no hay productos destacados disponibles.</p>
          )}
        </div>
      </section>
    </div>
  );
};
