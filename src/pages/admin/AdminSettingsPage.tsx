import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface BankForm {
  banco: string;
  tipo_cuenta: string;
  numero_cuenta: string;
  titular: string;
  ruc: string;
}

interface ShippingForm {
  direccion_tienda: string;
  retiro_tienda: number;
  por_provincia: Record<string, number>;
}

export const AdminSettingsPage: React.FC = () => {
  const [iva, setIva] = useState(15);
  const [bank, setBank] = useState<BankForm>({
    banco: import.meta.env.VITE_BANK_NAME,
    tipo_cuenta: import.meta.env.VITE_BANK_ACCOUNT_TYPE,
    numero_cuenta: import.meta.env.VITE_BANK_ACCOUNT_NUMBER,
    titular: import.meta.env.VITE_BANK_ACCOUNT_HOLDER,
    ruc: import.meta.env.VITE_BANK_ACCOUNT_RUC || ''
  });
  const [shipping, setShipping] = useState<ShippingForm>({
    direccion_tienda: 'Quito, Ecuador',
    retiro_tienda: 0,
    por_provincia: { Pichincha: 4.5 }
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: ivaSetting } = await supabase
        .from('settings')
        .select('valor_json')
        .eq('clave', 'iva')
        .single();
      if (ivaSetting?.valor_json?.porcentaje) {
        setIva(ivaSetting.valor_json.porcentaje);
      }
      const { data: bankSetting } = await supabase
        .from('settings')
        .select('valor_json')
        .eq('clave', 'datos_bancarios')
        .single();
      if (bankSetting?.valor_json) {
        setBank(bankSetting.valor_json as BankForm);
      }
      const { data: shippingSetting } = await supabase
        .from('settings')
        .select('valor_json')
        .eq('clave', 'tarifas_envio')
        .single();
      if (shippingSetting?.valor_json) {
        setShipping(shippingSetting.valor_json as ShippingForm);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await supabase.from('settings').upsert([
      { clave: 'iva', valor_json: { porcentaje: iva } },
      { clave: 'datos_bancarios', valor_json: bank },
      { clave: 'tarifas_envio', valor_json: shipping }
    ]);
    setMensaje('Configuración guardada correctamente.');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-secondary">Configuración general</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-3xl border border-grisFondo bg-white p-6">
          <h2 className="text-lg font-semibold text-secondary">IVA</h2>
          <p className="text-sm text-grisTexto">Solo los administradores pueden modificar el porcentaje vigente.</p>
          <input
            type="number"
            value={iva}
            onChange={(event) => setIva(Number(event.target.value))}
            className="mt-3 w-32 rounded-full border border-grisFondo px-4 py-2 text-sm"
            min={0}
            max={20}
            step={0.1}
          />
        </section>
        <section className="rounded-3xl border border-grisFondo bg-white p-6">
          <h2 className="text-lg font-semibold text-secondary">Datos bancarios</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Banco
              <input
                value={bank.banco}
                onChange={(event) => setBank((prev) => ({ ...prev, banco: event.target.value }))}
                className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              />
            </label>
            <label className="text-sm">
              Tipo de cuenta
              <input
                value={bank.tipo_cuenta}
                onChange={(event) => setBank((prev) => ({ ...prev, tipo_cuenta: event.target.value }))}
                className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              />
            </label>
            <label className="text-sm">
              Número de cuenta
              <input
                value={bank.numero_cuenta}
                onChange={(event) => setBank((prev) => ({ ...prev, numero_cuenta: event.target.value }))}
                className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              />
            </label>
            <label className="text-sm">
              Titular
              <input
                value={bank.titular}
                onChange={(event) => setBank((prev) => ({ ...prev, titular: event.target.value }))}
                className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              />
            </label>
            <label className="text-sm">
              RUC
              <input
                value={bank.ruc}
                onChange={(event) => setBank((prev) => ({ ...prev, ruc: event.target.value }))}
                className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              />
            </label>
          </div>
        </section>
        <section className="rounded-3xl border border-grisFondo bg-white p-6">
          <h2 className="text-lg font-semibold text-secondary">Envíos y retiro</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Dirección de retiro en tienda
              <input
                value={shipping.direccion_tienda}
                onChange={(event) => setShipping((prev) => ({ ...prev, direccion_tienda: event.target.value }))}
                className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              />
            </label>
            <label className="text-sm">
              Costo retiro en tienda (USD)
              <input
                type="number"
                value={shipping.retiro_tienda}
                onChange={(event) => setShipping((prev) => ({ ...prev, retiro_tienda: Number(event.target.value) }))}
                className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
                min={0}
                step={0.1}
              />
            </label>
          </div>
          <p className="mt-4 text-sm font-semibold text-secondary">Tarifas por provincia</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {Object.entries(shipping.por_provincia).map(([provincia, valor]) => (
              <label key={provincia} className="text-xs text-grisTexto">
                {provincia}
                <input
                  type="number"
                  value={valor}
                  onChange={(event) =>
                    setShipping((prev) => ({
                      ...prev,
                      por_provincia: { ...prev.por_provincia, [provincia]: Number(event.target.value) }
                    }))
                  }
                  className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
                  min={0}
                  step={0.1}
                />
              </label>
            ))}
          </div>
        </section>
        <button type="submit" className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white">
          Guardar configuración
        </button>
        {mensaje && <p className="text-sm text-secondary">{mensaje}</p>}
      </form>
    </div>
  );
};
