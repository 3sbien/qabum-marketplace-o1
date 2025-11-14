import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { BlogPost } from '../types/blog';
import { formatearFecha } from '../utils/format';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
      setPost((data || null) as BlogPost | null);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-responsive py-16">
        <p className="text-sm text-grisTexto">Cargando publicación…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-responsive py-16">
        <p className="text-sm text-grisTexto">No encontramos esta publicación.</p>
      </div>
    );
  }

  return (
    <article className="container-responsive prose prose-neutral max-w-3xl py-10">
      <p className="text-xs uppercase tracking-wide text-grisTexto">{formatearFecha(post.created_at_utc)}</p>
      <h1 className="text-3xl font-semibold text-secondary">{post.titulo}</h1>
      <div className="prose-p:text-secondary prose-p:text-base prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: post.contenido }} />
    </article>
  );
};
