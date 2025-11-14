import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { Order, PaymentReceipt } from '../types/order';
import { formatearPrecio } from '../utils/format';
import { useAuth } from '../context/AuthContext';

export const OrderPaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      const { data } = await supabase.from('orders').select('*, payments(*)').eq('order_code', id).single();
      if (data) {
        const orderData = data as Order & { payments?: PaymentReceipt[] };
        setOrder(orderData);
        setReceipt(orderData.payments?.[0] ?? null);
      }
    };
    fetchOrder();
  }, [id]);

  const manejarCarga = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo || !order) return;
    setSubiendo(true);
    const extension = archivo.name.split('.').pop();
    const filePath = `${order.order_code}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from('receipts').upload(filePath, archivo, {
      cacheControl: '3600',
      upsert: true
    });
    if (uploadError) {
      setMensaje('No pudimos subir el comprobante. Intenta nuevamente.');
      setSubiendo(false);
      return;
    }

    await supabase.from('payments').insert({
      order_id: order.id,
      metodo: 'transferencia',
      comprobante_url: filePath,
      estado: 'en_revision'
    });

    setMensaje('Comprobante enviado. Nuestro equipo lo revisará en las próximas horas.');
    setSubiendo(false);
  };

  if (!order) {
    return (
      <div className="container-responsive py-16">
        <p className="text-sm text-grisTexto">No encontramos el pedido solicitado.</p>
      </div>
    );
  }

  if (session?.user && order.user_id && session.user.id !== order.user_id) {
    return (
      <div className="container-responsive py-16">
        <p className="text-sm text-grisTexto">No tienes permisos para ver este pedido.</p>
      </div>
    );
  }

  return (
    <div className="container-responsive py-10">
      <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-grisFondo bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-secondary">Comprobante de pago</h1>
        <p className="text-sm text-grisTexto">Pedido {order.order_code}</p>
        <div className="rounded-3xl bg-grisFondo p-4 text-sm text-secondary">
          <p>Total a pagar: <strong>{formatearPrecio(order.total_usd)}</strong></p>
          <p>Estado actual: <strong className="uppercase">{order.status}</strong></p>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-secondary">Sube tu comprobante (imagen o PDF)</label>
          <input type="file" accept="image/*,application/pdf" onChange={manejarCarga} disabled={subiendo} />
          <p className="text-xs text-grisTexto">Formatos permitidos: JPG, PNG o PDF. Máximo 5MB.</p>
          {mensaje && <p className="text-sm text-secondary">{mensaje}</p>}
          {receipt ? (
            <a
              href={supabase.storage.from('receipts').getPublicUrl(receipt.comprobante_url).data.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm font-semibold text-secondary underline"
            >
              Ver comprobante enviado
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};
