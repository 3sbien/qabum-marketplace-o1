import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { puedeAccederAdmin } from '../../lib/auth';

const navLinks = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/sostenibilidad', label: 'Sostenibilidad' },
  { to: '/blog', label: 'Blog' }
];

export const Header: React.FC = () => {
  const { profile, session } = useAuth();

  return (
    <header className="bg-fondo/95 border-b border-grisFondo backdrop-blur supports-[backdrop-filter]:bg-fondo/75 sticky top-0 z-40">
      <div className="container-responsive flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={profile?.rol ? '/logo.svg' : '/logo.svg'} alt="Second Round" className="h-10 w-auto" />
          <span className="text-lg font-semibold tracking-tight">Second Round</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-secondary'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {puedeAccederAdmin(profile) && (
            <NavLink to="/admin" className="transition-colors hover:text-primary">
              Panel interno
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/favoritos"
            className="rounded-full border border-grisFondo px-4 py-2 text-sm font-medium transition hover:border-primary hover:text-primary"
          >
            Favoritos
          </Link>
          <Link
            to="/carrito"
            className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary/90"
          >
            Carrito
          </Link>
          {session ? (
            <Link to="/mis-pedidos" className="hidden text-sm font-medium md:inline">
              Hola, {profile?.nombre || 'cliente'}
            </Link>
          ) : (
            <Link to="/login" className="hidden text-sm font-medium md:inline">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
