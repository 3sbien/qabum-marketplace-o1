import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { BlogPost } from '../../types/blog';

export const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('blog_posts').select('*').order('created_at_utc', { ascending: false });
      setPosts((data || []) as BlogPost[]);
    };
    fetchPosts();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await supabase.from('blog_posts').insert({
      titulo,
      slug,
      contenido,
      publicado: true
    });
    setTitulo('');
    setSlug('');
    setContenido('');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-secondary">Entradas de blog</h1>
        <ul className="space-y-3 rounded-3xl border border-grisFondo bg-white p-6">
          {posts.map((post) => (
            <li key={post.id} className="text-sm">
              <p className="font-semibold text-secondary">{post.titulo}</p>
              <p className="text-xs text-grisTexto">Slug: {post.slug}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-3xl border border-grisFondo bg-white p-6">
        <h2 className="text-lg font-semibold text-secondary">Nueva entrada</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-secondary">Título</label>
            <input
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-secondary">Slug</label>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-secondary">Contenido (HTML simple)</label>
            <textarea
              value={contenido}
              onChange={(event) => setContenido(event.target.value)}
              className="mt-1 h-40 w-full rounded-3xl border border-grisFondo px-4 py-3 text-sm"
              required
            />
          </div>
          <button type="submit" className="w-full rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white">
            Publicar
          </button>
        </form>
      </section>
    </div>
  );
};
