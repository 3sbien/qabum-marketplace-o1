export interface BlogPost {
  id: string;
  slug: string;
  titulo: string;
  contenido: string;
  publicado: boolean;
  created_at_utc: string;
  updated_at_utc: string;
}
