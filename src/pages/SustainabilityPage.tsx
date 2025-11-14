import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const SustainabilityPage: React.FC = () => {
  const [contenido, setContenido] = useState<string>('');

  useEffect(() => {
    const fetchPage = async () => {
      const { data } = await supabase
        .from('settings')
        .select('valor_json')
        .eq('clave', 'pagina_sostenibilidad')
        .single();
      if (data?.valor_json?.contenido) {
        setContenido(data.valor_json.contenido);
      } else {
        setContenido(
          `<p>En Second Round creemos en alargar la vida útil de cada prenda. Comprar segunda mano reduce el consumo de agua, energía y materiales, a la vez que apoya a emprendedores locales. Cada pieza que eliges evita que textiles de calidad terminen en la basura.</p>
           <p>Trabajamos con estándares de curaduría para garantizar que cada prenda llegue en excelente estado. Nuestro equipo verifica cada detalle, higieniza y deja lista la prenda para su nuevo ciclo de vida.</p>
           <p>Estamos comprometidos con la moda circular ecuatoriana. Gracias por ser parte de este movimiento consciente.</p>`
        );
      }
    };
    fetchPage();
  }, []);

  return (
    <div className="container-responsive py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-secondary">Sostenibilidad en Second Round</h1>
        <div className="prose prose-neutral mt-6 text-secondary" dangerouslySetInnerHTML={{ __html: contenido }} />
      </div>
    </div>
  );
};
