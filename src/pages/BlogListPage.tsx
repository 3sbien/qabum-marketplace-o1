import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { BlogPost } from '../types/blog';
import { formatearFecha } from '../utils/format';

const fetchPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publicado', true)
    .order('created_at_utc', { ascending: false });
  if (error) throw error;
  return data as BlogPost[];
};

export const BlogListPage: React.FC = () => {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({ queryKey: ['blogPosts'], queryFn: fetchPosts });

  return (
    <div className="container-responsive py-10">
      <h1 className="text-2xl font-semibold text-secondary">Blog Second Round</h1>
      <p className="mt-2 text-sm text-grisTexto">
        Historias, consejos y tendencias para seguir disfrutando la moda circular en Ecuador.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {isLoading ? (
          <p className="text-sm text-grisTexto">Cargando artículos…</p>
        ) : posts?.length ? (
          posts.map((post) => (
            <article key={post.id} className="flex h-full flex-col rounded-3xl border border-grisFondo bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-grisTexto">{formatearFecha(post.created_at_utc)}</p>
              <h2 className="mt-2 text-lg font-semibold text-secondary">{post.titulo}</h2>
              <p className="mt-2 flex-1 text-sm text-grisTexto">{post.contenido.slice(0, 160)}…</p>
              <Link to={`/blog/${post.slug}`} className="mt-4 text-sm font-semibold text-secondary underline">
                Leer más
              </Link>
            </article>
          ))
        ) : (
          <p className="text-sm text-grisTexto">Aún no hay publicaciones disponibles.</p>
        )}
      </div>
    </div>
  );
};
