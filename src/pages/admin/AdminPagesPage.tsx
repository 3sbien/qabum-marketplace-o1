import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const AdminPagesPage: React.FC = () => {
  const [contenido, setContenido] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      const { data } = await supabase
        .from('settings')
        .select('valor_json')
        .eq('clave', 'pagina_sostenibilidad')
        .single();
      if (data?.valor_json?.contenido) {
        setContenido(data.valor_json.contenido);
      }
    };
    fetchPage();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await supabase.from('settings').upsert({
      clave: 'pagina_sostenibilidad',
      valor_json: { contenido }
    });
    setMensaje('Contenido actualizado correctamente.');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-secondary">Páginas estáticas</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-grisFondo bg-white p-6">
        <div>
          <label className="text-sm font-medium text-secondary">Contenido de sostenibilidad (HTML simple)</label>
          <textarea
            value={contenido}
            onChange={(event) => setContenido(event.target.value)}
            className="mt-1 h-64 w-full rounded-3xl border border-grisFondo px-4 py-3 text-sm"
          />
        </div>
        <button type="submit" className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white">
          Guardar cambios
        </button>
        {mensaje && <p className="text-sm text-secondary">{mensaje}</p>}
      </form>
    </div>
  );
};
