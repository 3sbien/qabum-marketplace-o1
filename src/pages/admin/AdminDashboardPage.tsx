import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import type { Order } from '../../types/order';
import { formatearFecha, formatearPrecio } from '../../utils/format';

const fetchResumen = async (): Promise<Order[]> => {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at_utc', { ascending: false })
    .limit(5);
  return (data || []) as Order[];
};

export const AdminDashboardPage: React.FC = () => {
  const { data: pedidosRecientes } = useQuery<Order[]>({ queryKey: ['adminDashboard'], queryFn: fetchResumen });

  const pendientes = pedidosRecientes ? pedidosRecientes.filter((order) => order.status === 'pendiente').length : 0;
  const conComprobante = pedidosRecientes ? pedidosRecientes.filter((order) => order.status === 'comprobante').length : 0;
  const ventas = pedidosRecientes
    ? pedidosRecientes
        .filter((order) => order.status === 'pagado')
        .reduce((acc, order) => acc + order.total_usd, 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-grisFondo p-4">
          <p className="text-xs uppercase tracking-wide text-grisTexto">Ventas recientes</p>
          <p className="mt-2 text-2xl font-semibold text-secondary">{formatearPrecio(ventas)}</p>
        </div>
        <div className="rounded-3xl bg-grisFondo p-4">
          <p className="text-xs uppercase tracking-wide text-grisTexto">Pedidos pendientes</p>
          <p className="mt-2 text-2xl font-semibold text-secondary">{pendientes}</p>
        </div>
        <div className="rounded-3xl bg-grisFondo p-4">
          <p className="text-xs uppercase tracking-wide text-grisTexto">Comprobantes por revisar</p>
          <p className="mt-2 text-2xl font-semibold text-secondary">{conComprobante}</p>
        </div>
      </div>
      <div className="rounded-3xl border border-grisFondo p-6">
        <h2 className="text-lg font-semibold text-secondary">Pedidos recientes</h2>
        <div className="mt-4 space-y-4">
          {pedidosRecientes && pedidosRecientes.length ? (
            pedidosRecientes.map((order) => (
              <div key={order.id} className="flex flex-col gap-2 border-b border-grisFondo pb-4 last:border-none">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
                  <span className="font-semibold">{order.order_code}</span>
                  <span>{formatearFecha(order.created_at_utc)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wide text-grisTexto">
                  <span>Estado: {order.status}</span>
                  <span>Total: {formatearPrecio(order.total_usd)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-grisTexto">No hay pedidos recientes.</p>
          )}
        </div>
      </div>
    </div>
  );
};
