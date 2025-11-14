import type { Order } from '../types/order';
import { formatearFecha } from './format';

export const enviarCorreoPedidoCreado = (datos: {
  correo: string;
  order: Order;
}) => {
  console.log('Enviar correo de pedido creado', {
    para: datos.correo,
    codigo: datos.order.order_code,
    total: datos.order.total_usd
  });
};

export const enviarCorreoPedidoPagado = (datos: {
  correo: string;
  order: Order;
}) => {
  console.log('Enviar correo de pedido pagado', {
    para: datos.correo,
    codigo: datos.order.order_code,
    total: datos.order.total_usd,
    fecha: datos.order.paid_at_utc ? formatearFecha(datos.order.paid_at_utc) : null
  });
};

const qabumUrl = (import.meta.env.QABUM_WEBHOOK_URL || '').trim();
const qabumEnabled = (import.meta.env.QABUM_ENABLED || 'false').toLowerCase() === 'true';

export const notificarQabum = async (order: Order, cliente?: { nombre: string; email: string }) => {
  if (!qabumEnabled || !qabumUrl) {
    console.info('Webhook de Qabum desactivado. No se enviará notificación.');
    return;
  }

  try {
    await fetch(qabumUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tienda: 'Second Round',
        order_code: order.order_code,
        total_usd: order.total_usd,
        fecha_pago_utc: order.paid_at_utc,
        cliente: cliente || null
      })
    });
  } catch (error) {
    console.error('Error al notificar a Qabum', error);
  }
};
