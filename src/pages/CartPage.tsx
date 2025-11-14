import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatearPrecio } from '../utils/format';

export const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity } = useCart();
  const subtotal = items.reduce((acc, item) => acc + item.product.precio_original_usd * item.quantity, 0);

  return (
    <div className="container-responsive py-10">
      <h1 className="text-2xl font-semibold text-secondary">Tu carrito</h1>
      <p className="mt-2 text-sm text-grisTexto">Revisa los productos antes de continuar al checkout.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-grisFondo bg-white p-6 text-sm text-grisTexto">
              Tu carrito está vacío. <Link to="/catalogo" className="font-semibold text-secondary underline">Explora el catálogo.</Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex flex-col gap-4 rounded-3xl border border-grisFondo bg-white p-4 sm:flex-row sm:items-center">
                <img src={item.product.imagenes?.[0] || '/placeholder-product.svg'} alt={item.product.nombre} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-secondary">{item.product.nombre}</h2>
                  <p className="text-xs text-grisTexto">{item.product.condicion} · {item.product.sku}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      Cantidad
                      <input
                        type="number"
                        min={1}
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
                        className="w-20 rounded-full border border-grisFondo px-3 py-1 text-sm"
                      />
                    </label>
                    <button type="button" onClick={() => removeItem(item.product.id)} className="text-sm text-red-500 underline">
                      Quitar
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-secondary">{formatearPrecio(item.product.precio_original_usd)}</p>
              </div>
            ))
          )}
        </section>
        <aside className="space-y-4 rounded-3xl border border-grisFondo bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-secondary">Resumen</h2>
          <div className="flex items-center justify-between text-sm text-secondary">
            <span>Subtotal</span>
            <span>{formatearPrecio(subtotal)}</span>
          </div>
          <p className="text-xs text-grisTexto">El IVA y el envío se calcularán en el checkout.</p>
          <Link
            to="/checkout"
            className={`block rounded-full px-6 py-3 text-center text-sm font-semibold text-white transition ${
              items.length ? 'bg-secondary hover:bg-secondary/90' : 'bg-grisTexto/40 cursor-not-allowed'
            }`}
          >
            Ir al checkout
          </Link>
        </aside>
      </div>
    </div>
  );
};
