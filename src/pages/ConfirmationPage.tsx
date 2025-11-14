import { Link, useLocation, useParams } from 'react-router-dom';
import { formatearPrecio } from '../utils/format';

export const ConfirmationPage: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const location = useLocation();
  const state = (location.state as
    | { total: number; subtotal: number; ivaMonto: number; ivaPorcentaje: number; costoEnvio: number }
    | undefined) ?? { total: 0, subtotal: 0, ivaMonto: 0, ivaPorcentaje: 15, costoEnvio: 0 };

  return (
    <div className="container-responsive py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-grisFondo bg-white p-10 text-center shadow-sm">
        <span className="inline-flex items-center justify-center rounded-full bg-primary/60 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-secondary">
          ¡Pedido recibido!
        </span>
        <h1 className="mt-6 text-3xl font-semibold text-secondary">Gracias por confiar en Second Round</h1>
        <p className="mt-3 text-sm text-grisTexto">
          Hemos creado tu pedido <strong>{orderCode}</strong>. Realiza la transferencia usando nuestros datos bancarios y
          sube el comprobante para acelerar la validación.
        </p>
        <div className="mt-8 grid gap-4 text-sm text-secondary sm:grid-cols-2">
          <div className="rounded-3xl border border-grisFondo p-4">
            <h2 className="text-base font-semibold">Resumen de pago</h2>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatearPrecio(state.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA ({state.ivaPorcentaje}%)</span>
                <span>{formatearPrecio(state.ivaMonto)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{formatearPrecio(state.costoEnvio)}</span>
              </div>
              <div className="flex justify-between border-t border-grisFondo pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatearPrecio(state.total)}</span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-grisFondo p-4 text-left">
            <h2 className="text-base font-semibold">¿Qué sigue?</h2>
            <ol className="mt-3 space-y-2 text-sm text-grisTexto">
              <li>1. Realiza la transferencia usando los datos bancarios oficiales.</li>
              <li>2. Usa tu código de pedido como referencia.</li>
              <li>3. Sube tu comprobante para que el equipo lo revise.</li>
              <li>4. Te notificaremos cuando el pago sea aprobado.</li>
            </ol>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/mis-pedidos"
            className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90"
          >
            Ver mis pedidos
          </Link>
          <Link
            to={`/ordenes/${orderCode}/pago`}
            className="rounded-full border border-secondary px-6 py-3 text-sm font-semibold text-secondary transition hover:bg-primary/40"
          >
            Subir comprobante
          </Link>
        </div>
      </div>
    </div>
  );
};
