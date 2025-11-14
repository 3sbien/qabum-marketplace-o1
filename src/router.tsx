import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { OrderPaymentPage } from './pages/OrderPaymentPage';
import { WishlistPage } from './pages/WishlistPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LegalTermsPage } from './pages/LegalTermsPage';
import { LegalPrivacyPage } from './pages/LegalPrivacyPage';
import { LegalReturnsPage } from './pages/LegalReturnsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminPagesPage } from './pages/admin/AdminPagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { puedeAccederAdmin } from './lib/auth';
import { useAuth } from './context/AuthContext';
import { SustainabilityPage as SostenibilidadPage } from './pages/SustainabilityPage';

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useAuth();
  if (loading) {
    return <div className="container-responsive py-16 text-center text-sm text-grisTexto">Cargando…</div>;
  }
  if (!puedeAccederAdmin(profile)) {
    return (
      <div className="container-responsive py-16 text-center text-sm text-grisTexto">
        No tienes permisos para acceder al panel interno.
      </div>
    );
  }
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  if (loading) {
    return <div className="container-responsive py-16 text-center text-sm text-grisTexto">Cargando…</div>;
  }
  if (!session) {
    return (
      <div className="container-responsive py-16 text-center text-sm text-grisTexto">
        Necesitas iniciar sesión para continuar.
      </div>
    );
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogo', element: <CatalogPage /> },
      { path: 'producto/:slug', element: <ProductDetailPage /> },
      { path: 'carrito', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'confirmacion/:orderCode', element: <ConfirmationPage /> },
      {
        path: 'mis-pedidos',
        element: (
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        )
      },
      { path: 'ordenes/:id/pago', element: <OrderPaymentPage /> },
      {
        path: 'favoritos',
        element: (
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        )
      },
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
      { path: 'sostenibilidad', element: <SostenibilidadPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'registro', element: <RegisterPage /> },
      { path: 'terminos', element: <LegalTermsPage /> },
      { path: 'privacidad', element: <LegalPrivacyPage /> },
      { path: 'cambios-devoluciones', element: <LegalReturnsPage /> }
    ]
  },
  {
    path: '/admin',
    element: (
      <ProtectedAdmin>
        <AdminLayout />
      </ProtectedAdmin>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'productos', element: <AdminProductsPage /> },
      { path: 'categorias', element: <AdminCategoriesPage /> },
      { path: 'pedidos', element: <AdminOrdersPage /> },
      { path: 'clientes', element: <AdminCustomersPage /> },
      { path: 'blog', element: <AdminBlogPage /> },
      { path: 'paginas', element: <AdminPagesPage /> },
      { path: 'configuracion', element: <AdminSettingsPage /> },
      { path: 'reportes', element: <AdminReportsPage /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
