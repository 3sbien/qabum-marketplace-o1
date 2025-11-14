import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

export const WishlistPage: React.FC = () => {
  const { favoritos, loading } = useWishlist();
  const { session } = useAuth();

  if (!session?.user) {
    return (
      <div className="container-responsive py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-grisFondo bg-white p-6 text-center text-sm text-grisTexto">
          Inicia sesión para guardar y ver tus favoritos.
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-10">
      <h1 className="text-2xl font-semibold text-secondary">Mis favoritos</h1>
      <p className="mt-2 text-sm text-grisTexto">Estas son las piezas que guardaste para decidir luego.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <p className="text-sm text-grisTexto">Cargando favoritos…</p>
        ) : favoritos.length ? (
          favoritos.map((item) => item.product && <ProductCard key={item.product_id} product={item.product} />)
        ) : (
          <p className="text-sm text-grisTexto">Aún no agregas productos a tu lista de deseos.</p>
        )}
      </div>
    </div>
  );
};
