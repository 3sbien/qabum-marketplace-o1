export interface Category {
  id: string;
  nombre: string;
  slug: string;
  parent_id: string | null;
  nivel: number;
  created_at_utc: string;
  updated_at_utc: string;
  children?: Category[];
}
