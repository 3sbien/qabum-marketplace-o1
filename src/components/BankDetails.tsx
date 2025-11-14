import { useState } from 'react';

export const BankDetails: React.FC = () => {
  const [copiado, setCopiado] = useState(false);

  const datos = `Banco: ${import.meta.env.VITE_BANK_NAME}\nTipo de cuenta: ${import.meta.env.VITE_BANK_ACCOUNT_TYPE}\nNúmero de cuenta: ${import.meta.env.VITE_BANK_ACCOUNT_NUMBER}\nTitular: ${import.meta.env.VITE_BANK_ACCOUNT_HOLDER}\nRUC/Cédula: ${import.meta.env.VITE_BANK_ACCOUNT_RUC}`;

  const copiar = async () => {
    await navigator.clipboard.writeText(`${datos}\nUsa tu código de pedido como referencia.`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="rounded-3xl border border-grisFondo bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Datos para transferencia bancaria</h3>
      <p className="mt-2 text-sm text-grisTexto">Usa tu código de pedido como referencia.</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="font-medium text-secondary">Banco</dt>
          <dd>{import.meta.env.VITE_BANK_NAME}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-medium text-secondary">Tipo de cuenta</dt>
          <dd className="capitalize">{import.meta.env.VITE_BANK_ACCOUNT_TYPE}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-medium text-secondary">Número de cuenta</dt>
          <dd>{import.meta.env.VITE_BANK_ACCOUNT_NUMBER}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-medium text-secondary">Titular</dt>
          <dd>{import.meta.env.VITE_BANK_ACCOUNT_HOLDER}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-medium text-secondary">RUC / Cédula</dt>
          <dd>{import.meta.env.VITE_BANK_ACCOUNT_RUC || 'Por confirmar'}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={copiar}
        className="mt-6 w-full rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary/90"
      >
        {copiado ? 'Datos copiados' : 'Copiar datos bancarios'}
      </button>
    </div>
  );
};
