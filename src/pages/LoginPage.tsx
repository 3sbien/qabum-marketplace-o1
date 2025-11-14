import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMensaje('Credenciales inválidas o cuenta no verificada.');
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="container-responsive py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-grisFondo bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-secondary">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-grisTexto">Ingresa tus credenciales para continuar.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-secondary">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-secondary">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              required
            />
          </div>
          {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary/90"
            disabled={loading}
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-grisTexto">
          ¿Olvidaste tu contraseña?
          <button
            type="button"
            className="ml-1 underline"
            onClick={async () => {
              if (!email) {
                setMensaje('Ingresa tu correo para enviar el enlace de recuperación.');
                return;
              }
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/login'
              });
              setMensaje(error ? 'No se pudo enviar el correo. Intenta más tarde.' : 'Revisa tu correo para restablecer la contraseña.');
            }}
          >
            Recuperar acceso
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-grisTexto">
          ¿Aún no tienes cuenta? <Link to="/registro" className="font-semibold text-secondary underline">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
};
