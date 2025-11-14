import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
  <div className="container-responsive py-16 text-center">
    <h1 className="text-4xl font-semibold text-secondary">Página no encontrada</h1>
    <p className="mt-3 text-sm text-grisTexto">
      Lo sentimos, no pudimos encontrar la página que buscas. Regresa al inicio para seguir explorando Second Round.
    </p>
    <Link
      to="/"
      className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90"
    >
      Volver al inicio
    </Link>
  </div>
);
