import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Order } from '../../types/order';
import { formatearFecha, formatearPrecio } from '../../utils/format';
import { enviarCorreoPedidoPagado, notificarQabum } from '../../utils/notifications';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, shipping_addresses(*), order_items(*)')
        .order('created_at_utc', { ascending: false });
      setOrders((data || []) as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const cambiarEstado = async (order: Order, status: Order['status']) => {
    await supabase.from('orders').update({ status }).eq('id', order.id);
    if (status === 'pagado') {
      const paidAt = new Date().toISOString();
      await supabase.from('orders').update({ paid_at_utc: paidAt }).eq('id', order.id);
      enviarCorreoPedidoPagado({ correo: order.shipping_address?.email || '', order: { ...order, status, paid_at_utc: paidAt } });
      await notificarQabum({ ...order, status, paid_at_utc: paidAt }, {
        nombre: `${order.shipping_address?.nombre ?? ''} ${order.shipping_address?.apellido ?? ''}`.trim(),
        email: order.shipping_address?.email || ''
      });
    }
    setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status } : item)));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-secondary">Pedidos</h1>
      <div className="overflow-x-auto rounded-3xl border border-grisFondo">
        <table className="min-w-full divide-y divide-grisFondo text-sm">
          <thead className="bg-grisFondo">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grisTexto">Código</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grisTexto">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grisTexto">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grisTexto">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grisTexto">Creado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-grisFondo">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-grisTexto">
                  Cargando pedidos…
                </td>
              </tr>
            ) : orders.length ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-semibold text-secondary">{order.order_code}</td>
                  <td className="px-4 py-3 text-sm text-secondary">
                    {order.shipping_address
                      ? `${order.shipping_address.nombre} ${order.shipping_address.apellido}`
                      : 'Sin datos'}
                  </td>
                  <td className="px-4 py-3">{formatearPrecio(order.total_usd)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-grisFondo px-3 py-1 text-xs font-semibold uppercase">{order.status}</span>
                  </td>
                  <td className="px-4 py-3">{formatearFecha(order.created_at_utc)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => cambiarEstado(order, 'pagado')}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white"
                      >
                        Marcar pagado
                      </button>
                      <button
                        onClick={() => cambiarEstado(order, 'cancelado')}
                        className="rounded-full border border-secondary px-3 py-1 text-xs font-semibold text-secondary"
                      >
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-grisTexto">
                  No hay pedidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
