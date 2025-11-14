import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type AdminRole = 'ADMIN' | 'SUBADMIN' | 'VENTAS' | 'BODEGA';

const adminLinks: { to: string; label: string; roles: AdminRole[] }[] = [
  { to: '/admin', label: 'Resumen', roles: ['ADMIN', 'SUBADMIN', 'VENTAS', 'BODEGA'] },
  { to: '/admin/productos', label: 'Productos', roles: ['ADMIN', 'SUBADMIN', 'BODEGA'] },
  { to: '/admin/categorias', label: 'Categorías', roles: ['ADMIN', 'SUBADMIN', 'BODEGA'] },
  { to: '/admin/pedidos', label: 'Pedidos', roles: ['ADMIN', 'SUBADMIN', 'VENTAS', 'BODEGA'] },
  { to: '/admin/clientes', label: 'Clientes', roles: ['ADMIN', 'SUBADMIN', 'VENTAS'] },
  { to: '/admin/blog', label: 'Blog', roles: ['ADMIN', 'SUBADMIN'] },
  { to: '/admin/paginas', label: 'Páginas', roles: ['ADMIN', 'SUBADMIN'] },
  { to: '/admin/configuracion', label: 'Configuración', roles: ['ADMIN', 'SUBADMIN'] },
  { to: '/admin/reportes', label: 'Exportar datos', roles: ['ADMIN', 'SUBADMIN'] }
];

export const AdminLayout: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-grisFondo">
      <div className="flex flex-col gap-6 p-4 lg:flex-row">
        <aside className="w-full rounded-3xl bg-white p-6 shadow-sm lg:w-64">
          <h2 className="mb-6 text-lg font-semibold">Panel Second Round</h2>
          <nav className="space-y-2">
            {adminLinks
              .filter((link) => (profile ? link.roles.includes(profile.rol as AdminRole) : false))
              .map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    `block rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-secondary text-white' : 'text-secondary hover:bg-grisFondo'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
          </nav>
        </aside>
        <section className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
          <Outlet />
        </section>
      </div>
    </div>
  );
};
