import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types/order';
import { formatearFecha, formatearPrecio } from '../utils/format';

export const MyOrdersPage: React.FC = () => {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('orders')
        .select('*, shipping_addresses(*), order_items(*)')
        .eq('user_id', session.user.id)
        .order('created_at_utc', { ascending: false });
      setOrders((data || []) as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, [session?.user?.id]);

  if (!session?.user) {
    return (
      <div className="container-responsive py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-grisFondo bg-white p-6 text-center text-sm text-grisTexto">
          Debes iniciar sesión para ver tus pedidos.
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-10">
      <h1 className="text-2xl font-semibold text-secondary">Mis pedidos</h1>
      <p className="mt-2 text-sm text-grisTexto">Consulta el estado de tus compras y sube los comprobantes.</p>
      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-grisTexto">Cargando pedidos…</p>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-grisFondo bg-white p-6 text-sm text-grisTexto">
            Aún no tienes pedidos registrados.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-grisFondo bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-secondary">Pedido {order.order_code}</h2>
                  <p className="text-xs text-grisTexto">Creado el {formatearFecha(order.created_at_utc)}</p>
                  <p className="mt-2 text-xs text-grisTexto uppercase tracking-wide">Estado: {order.status}</p>
                </div>
                <div className="text-right text-sm text-secondary">
                  <p>Total pagado</p>
                  <p className="text-lg font-semibold">{formatearPrecio(order.total_usd)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <Link
                  to={`/ordenes/${order.order_code}/pago`}
                  className="rounded-full border border-secondary px-4 py-2 font-semibold text-secondary transition hover:bg-primary/40"
                >
                  {order.status === 'pagado' ? 'Ver comprobante' : 'Subir comprobante'}
                </Link>
                {order.link_pago_externo ? (
                  <a
                    href={order.link_pago_externo}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-secondary px-4 py-2 font-semibold text-white transition hover:bg-secondary/90"
                  >
                    Pagar con enlace externo
                  </a>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
