import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Profile } from '../../types/profile';

export const AdminCustomersPage: React.FC = () => {
  const [clientes, setClientes] = useState<Profile[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at_utc', { ascending: false });
      setClientes((data || []) as Profile[]);
    };
    fetchClientes();
  }, []);

  const filtrados = clientes.filter((cliente) =>
    [cliente.nombre, cliente.apellido, cliente.documento]
      .join(' ')
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">Clientes</h1>
          <p className="text-sm text-grisTexto">Consulta datos básicos y roles asignados.</p>
        </div>
        <input
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por nombre o documento"
          className="w-full rounded-full border border-grisFondo px-4 py-2 text-sm sm:w-72"
        />
      </div>
      <div className="overflow-x-auto rounded-3xl border border-grisFondo">
        <table className="min-w-full divide-y divide-grisFondo text-sm">
          <thead className="bg-grisFondo">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grisTexto">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grisTexto">Contacto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grisTexto">Documento</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-grisTexto">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grisFondo">
            {filtrados.map((cliente) => (
              <tr key={cliente.user_id}>
                <td className="px-4 py-3 font-semibold text-secondary">
                  {cliente.nombre} {cliente.apellido}
                </td>
                <td className="px-4 py-3 text-sm text-grisTexto">
                  <div>Tel: {cliente.telefono || 'N/D'}</div>
                  <div>WhatsApp: {cliente.whatsapp || 'N/D'}</div>
                </td>
                <td className="px-4 py-3 text-sm text-secondary">{cliente.documento || 'Pendiente'}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-grisFondo px-3 py-1 text-xs font-semibold uppercase">{cliente.rol}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
