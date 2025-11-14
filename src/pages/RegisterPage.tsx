import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nombre, apellido } } });
    if (error) {
      setMensaje('No pudimos crear tu cuenta. Intenta de nuevo.');
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        nombre,
        apellido,
        telefono: null,
        whatsapp: null,
        documento: null,
        rol: 'CLIENTE',
        created_at_utc: new Date().toISOString(),
        updated_at_utc: new Date().toISOString()
      });
    }

    setMensaje('Revisa tu correo y confirma tu cuenta para iniciar sesión.');
    setLoading(false);
    setTimeout(() => navigate('/login'), 4000);
  };

  return (
    <div className="container-responsive py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-grisFondo bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-secondary">Crear cuenta</h1>
        <p className="mt-2 text-sm text-grisTexto">Regístrate para comprar más rápido y seguir tus pedidos.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-secondary">Nombre</label>
            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-secondary">Apellido</label>
            <input
              value={apellido}
              onChange={(event) => setApellido(event.target.value)}
              className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              required
            />
          </div>
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
          {mensaje && <p className="text-sm text-secondary">{mensaje}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary/90"
            disabled={loading}
          >
            {loading ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-grisTexto">
          ¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-secondary underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};
