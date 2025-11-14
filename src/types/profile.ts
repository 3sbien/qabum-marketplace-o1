export type RolUsuario = 'ADMIN' | 'SUBADMIN' | 'VENTAS' | 'BODEGA' | 'CLIENTE';

export interface Profile {
  user_id: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  whatsapp: string | null;
  documento: string | null;
  rol: RolUsuario;
  created_at_utc: string;
  updated_at_utc: string;
}
