import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { provinciasEcuador } from '../utils/constants';
import { formatearPrecio } from '../utils/format';
import { BankDetails } from '../components/BankDetails';
import type { Order } from '../types/order';
import { enviarCorreoPedidoCreado } from '../utils/notifications';
import { useAuth } from '../context/AuthContext';

const checkoutSchema = z.object({
  nombre: z.string().min(2, 'Ingresa tu nombre'),
  apellido: z.string().min(2, 'Ingresa tu apellido'),
  email: z.string().email('Ingresa un correo válido'),
  telefono: z.string().min(7, 'Ingresa un teléfono válido'),
  whatsapp: z.string().optional(),
  documento: z.string().min(8, 'Ingresa tu cédula o RUC'),
  direccion: z.string().min(5, 'Ingresa tu dirección'),
  ciudad: z.string().min(2, 'Ingresa tu ciudad'),
  provincia: z.string().min(2, 'Selecciona una provincia'),
  referencia: z.string().optional(),
  metodoEntrega: z.enum(['envio', 'retiro']),
  metodoPago: z.enum(['transferencia', 'link_externo']).default('transferencia')
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const generarCodigoPedido = () => {
  const fecha = new Date();
  const yyyy = fecha.getUTCFullYear();
  const mm = String(fecha.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getUTCDate()).padStart(2, '0');
  const aleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SR-${yyyy}${mm}${dd}-${aleatorio}`;
};

export const CheckoutPage: React.FC = () => {
  const { items, clear } = useCart();
  const { profile, session } = useAuth();
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      metodoEntrega: 'envio',
      metodoPago: 'transferencia',
      nombre: profile?.nombre || '',
      apellido: profile?.apellido || '',
      email: session?.user?.email || ''
    }
  });

  const metodoEntrega = watch('metodoEntrega');

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.product.precio_original_usd * item.quantity, 0),
    [items]
  );

  const ivaPorcentaje = 15; // Este valor se obtiene de settings en una implementación completa.
  const ivaMonto = subtotal * (ivaPorcentaje / 100);
  const costoEnvio = metodoEntrega === 'envio' ? 5 : 0; // Simplificado para esta versión.
  const total = subtotal + ivaMonto + costoEnvio;

  const onSubmit = async (data: CheckoutForm) => {
    if (!items.length) return;
    setGuardando(true);
    const orderCode = generarCodigoPedido();
    const { data: orderInsert, error } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        user_id: session?.user?.id ?? null,
        subtotal_usd: subtotal,
        iva_porcentaje: ivaPorcentaje,
        iva_monto_usd: ivaMonto,
        costo_envio_usd: costoEnvio,
        total_usd: total,
        metodo_pago: data.metodoPago,
        status: 'pendiente',
        expires_at_utc: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (error || !orderInsert) {
      console.error(error);
      setGuardando(false);
      return;
    }

    const orderId = orderInsert.id;

    await supabase.from('shipping_addresses').insert({
      order_id: orderId,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      whatsapp: data.whatsapp || data.telefono,
      documento: data.documento,
      direccion: data.direccion,
      ciudad: data.ciudad,
      provincia: data.provincia,
      referencia: data.referencia || ''
    });

    await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: orderId,
        product_id: item.product.id,
        nombre: item.product.nombre,
        sku: item.product.sku,
        precio_unitario_usd: item.product.precio_original_usd,
        cantidad: item.quantity,
        total_item_usd: item.product.precio_original_usd * item.quantity
      }))
    );

    clear();

    enviarCorreoPedidoCreado({
      correo: data.email,
      order: orderInsert as Order
    });

    navigate(`/confirmacion/${orderCode}`, {
      state: {
        total,
        subtotal,
        ivaMonto,
        ivaPorcentaje,
        costoEnvio
      }
    });
  };

  return (
    <div className="container-responsive py-10">
      <h1 className="text-2xl font-semibold text-secondary">Checkout</h1>
      <p className="mt-2 text-sm text-grisTexto">Completa tus datos para confirmar el pedido.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="space-y-6 rounded-3xl border border-grisFondo bg-white p-6 shadow-sm lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-secondary">Nombre</label>
              <input {...register('nombre')} className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm" />
              {errors.nombre && <span className="text-xs text-red-500">{errors.nombre.message}</span>}
            </div>
            <div>
              <label className="text-sm font-medium text-secondary">Apellido</label>
              <input {...register('apellido')} className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm" />
              {errors.apellido && <span className="text-xs text-red-500">{errors.apellido.message}</span>}
            </div>
            <div>
              <label className="text-sm font-medium text-secondary">Correo electrónico</label>
              <input {...register('email')} className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm" />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>
            <div>
              <label className="text-sm font-medium text-secondary">Teléfono</label>
              <input {...register('telefono')} className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm" />
              {errors.telefono && <span className="text-xs text-red-500">{errors.telefono.message}</span>}
            </div>
            <div>
              <label className="text-sm font-medium text-secondary">WhatsApp</label>
              <input {...register('whatsapp')} className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary">Documento (cédula o RUC)</label>
              <input {...register('documento')} className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm" />
              {errors.documento && <span className="text-xs text-red-500">{errors.documento.message}</span>}
            </div>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-secondary">Dirección</label>
              <input {...register('direccion')} className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm" />
              {errors.direccion && <span className="text-xs text-red-500">{errors.direccion.message}</span>}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-secondary">Ciudad</label>
                <input {...register('ciudad')} className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm" />
                {errors.ciudad && <span className="text-xs text-red-500">{errors.ciudad.message}</span>}
              </div>
              <div>
                <label className="text-sm font-medium text-secondary">Provincia</label>
                <select
                  {...register('provincia')}
                  className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
                >
                  <option value="">Selecciona provincia</option>
                  {provinciasEcuador.map((provincia) => (
                    <option key={provincia} value={provincia}>
                      {provincia}
                    </option>
                  ))}
                </select>
                {errors.provincia && <span className="text-xs text-red-500">{errors.provincia.message}</span>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary">Referencia</label>
              <textarea
                {...register('referencia')}
                className="mt-1 w-full rounded-3xl border border-grisFondo px-4 py-3 text-sm"
                rows={3}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-grisFondo p-4">
              <h3 className="text-sm font-semibold text-secondary">Entrega</h3>
              <div className="mt-3 space-y-2 text-sm text-grisTexto">
                <label className="flex items-center gap-2">
                  <input type="radio" value="envio" {...register('metodoEntrega')} />
                  Envío a domicilio (tarifa según provincia)
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="retiro" {...register('metodoEntrega')} />
                  Retiro en tienda (Quito)
                </label>
              </div>
            </div>
            <div className="rounded-3xl border border-grisFondo p-4">
              <h3 className="text-sm font-semibold text-secondary">Pago</h3>
              <div className="mt-3 space-y-2 text-sm text-grisTexto">
                <label className="flex items-center gap-2">
                  <input type="radio" value="transferencia" {...register('metodoPago')} />
                  Transferencia bancaria
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="link_externo" {...register('metodoPago')} />
                  Link de pago externo (te enviaremos el enlace)
                </label>
              </div>
            </div>
          </div>
        </section>
        <aside className="space-y-6 rounded-3xl border border-grisFondo bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-secondary">Resumen de pago</h2>
            <div className="mt-4 space-y-2 text-sm text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatearPrecio(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA ({ivaPorcentaje}%)</span>
                <span>{formatearPrecio(ivaMonto)}</span>
              </div>
              <div className="flex justify-between">
                <span>{metodoEntrega === 'envio' ? 'Envío a domicilio' : 'Retiro en tienda'}</span>
                <span>{formatearPrecio(costoEnvio)}</span>
              </div>
              <div className="flex justify-between border-t border-grisFondo pt-2 text-base font-semibold">
                <span>Total a pagar</span>
                <span>{formatearPrecio(total)}</span>
              </div>
            </div>
          </div>
          <BankDetails />
          <button
            type="submit"
            disabled={guardando || items.length === 0}
            className="w-full rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:bg-grisTexto/40"
          >
            {guardando ? 'Creando pedido…' : 'Confirmar pedido'}
          </button>
        </aside>
      </form>
    </div>
  );
};
