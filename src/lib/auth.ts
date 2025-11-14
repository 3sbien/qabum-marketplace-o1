import type { Session, User } from '@supabase/supabase-js';
import type { Profile, RolUsuario } from '../types/profile';

export interface UsuarioSesion {
  user: User;
  profile: Profile | null;
  session: Session | null;
}

export const rolesInternos: RolUsuario[] = ['ADMIN', 'SUBADMIN', 'VENTAS', 'BODEGA'];

export const esAdmin = (profile?: Profile | null) => profile?.rol === 'ADMIN';
export const esSubAdmin = (profile?: Profile | null) => profile?.rol === 'SUBADMIN';
export const esVentas = (profile?: Profile | null) => profile?.rol === 'VENTAS';
export const esBodega = (profile?: Profile | null) => profile?.rol === 'BODEGA';
export const esCliente = (profile?: Profile | null) => profile?.rol === 'CLIENTE';

export const puedeAccederAdmin = (profile?: Profile | null) => {
  if (!profile) return false;
  return rolesInternos.includes(profile.rol);
};

export const nombreCompleto = (profile?: Profile | null) => {
  if (!profile) return '';
  return [profile.nombre, profile.apellido].filter(Boolean).join(' ');
};
