import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Order } from '../../types/order';
import type { Product } from '../../types/product';

const exportarCSV = (filename: string, rows: Record<string, unknown>[]) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const contenido = [headers.join(','), ...rows.map((row) => headers.map((key) => JSON.stringify(row[key] ?? '')).join(','))].join('\n');
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const AdminReportsPage: React.FC = () => {
  const [mensaje, setMensaje] = useState('');

  const exportarPedidos = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at_utc', { ascending: false });
    exportarCSV('pedidos.csv', (data as Order[]).map((order) => ({
      codigo: order.order_code,
      total: order.total_usd,
      estado: order.status,
      creado: order.created_at_utc
    })));
    setMensaje('Archivo de pedidos generado.');
  };

  const exportarInventario = async () => {
    const { data } = await supabase.from('products').select('*').order('nombre', { ascending: true });
    exportarCSV('inventario.csv', (data as Product[]).map((product) => ({
      nombre: product.nombre,
      sku: product.sku,
      stock: product.stock,
      precio: product.precio_original_usd,
      activo: product.activo
    })));
    setMensaje('Archivo de inventario generado.');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-secondary">Exportar datos</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <button onClick={exportarPedidos} className="rounded-3xl bg-secondary px-6 py-4 text-sm font-semibold text-white">
          Exportar pedidos
        </button>
        <button onClick={exportarInventario} className="rounded-3xl border border-secondary px-6 py-4 text-sm font-semibold text-secondary">
          Exportar inventario
        </button>
      </div>
      {mensaje && <p className="text-sm text-secondary">{mensaje}</p>}
    </div>
  );
};
