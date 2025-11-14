import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Category } from '../../types/category';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('nombre', { ascending: true });
      setCategories((data || []) as Category[]);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await supabase.from('categories').insert({
      nombre,
      slug,
      parent_id: parentId,
      nivel: parentId ? 1 : 0
    });
    setNombre('');
    setSlug('');
    setParentId(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">Categorías</h1>
          <p className="text-sm text-grisTexto">Crea y organiza el árbol de categorías y subcategorías.</p>
        </div>
        <ul className="space-y-2 rounded-3xl border border-grisFondo bg-white p-6">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between text-sm">
              <span>
                {category.nombre}
                {category.parent_id ? <span className="text-xs text-grisTexto"> · Subcategoría</span> : null}
              </span>
              <span className="text-xs uppercase text-grisTexto">{category.slug}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-3xl border border-grisFondo bg-white p-6">
        <h2 className="text-lg font-semibold text-secondary">Nueva categoría</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
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
            <label className="text-sm font-medium text-secondary">Slug</label>
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-secondary">Categoría padre</label>
            <select
              value={parentId || ''}
              onChange={(event) => setParentId(event.target.value || null)}
              className="mt-1 w-full rounded-full border border-grisFondo px-4 py-2 text-sm"
            >
              <option value="">Nivel principal</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white">
            Guardar categoría
          </button>
        </form>
      </section>
    </div>
  );
};
