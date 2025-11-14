import { Link } from 'react-router-dom';

const enlacesLegales = [
  { to: '/terminos', label: 'Términos y condiciones' },
  { to: '/privacidad', label: 'Política de privacidad' },
  { to: '/cambios-devoluciones', label: 'Cambios y devoluciones' }
];

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-grisFondo bg-grisFondo/60">
      <div className="container-responsive grid gap-8 py-10 md:grid-cols-3">
        <div>
          <img src="/logo.svg" alt="Second Round" className="mb-4 h-12 w-auto" />
          <p className="text-sm text-grisTexto">
            Second Round es tu espacio de moda circular en Ecuador. Curamos piezas de segunda mano en excelente estado
            para darles una nueva vida.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary">Enlaces rápidos</h4>
          <ul className="space-y-2 text-sm text-grisTexto">
            <li>
              <Link to="/catalogo" className="hover:text-primary">
                Catálogo completo
              </Link>
            </li>
            <li>
              <Link to="/favoritos" className="hover:text-primary">
                Favoritos
              </Link>
            </li>
            <li>
              <Link to="/mis-pedidos" className="hover:text-primary">
                Mis pedidos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary">Contáctanos</h4>
          <p className="text-sm text-grisTexto">WhatsApp: <a href={import.meta.env.VITE_WHATSAPP_URL} className="underline">Escríbenos</a></p>
          <p className="text-sm text-grisTexto">Correo: hola@secondround.ec</p>
          <div className="mt-4 flex gap-4 text-sm text-grisTexto">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary">
              Instagram
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="hover:text-primary">
              TikTok
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-grisFondo bg-white/80 py-4">
        <div className="container-responsive flex flex-col items-center justify-between gap-4 text-xs text-grisTexto sm:flex-row">
          <span>© {new Date().getFullYear()} Second Round. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            {enlacesLegales.map((enlace) => (
              <Link key={enlace.to} to={enlace.to} className="hover:text-primary">
                {enlace.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
