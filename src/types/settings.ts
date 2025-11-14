export interface IvaSetting {
  porcentaje: number;
}

export interface ShippingSettings {
  por_provincia: Record<string, number>;
  retiro_tienda: number;
  direccion_tienda: string;
}

export interface SocialSettings {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  whatsapp?: string;
  email_contacto?: string;
}

export interface BankSettings {
  banco: string;
  tipo_cuenta: string;
  numero_cuenta: string;
  titular: string;
  ruc: string;
}

export interface GeneralSettings {
  logo_url?: string;
  whatsapp_publico?: string;
  telefono_contacto?: string;
}

export type SettingValue =
  | { porcentaje: number }
  | ShippingSettings
  | SocialSettings
  | BankSettings
  | GeneralSettings
  | Record<string, unknown>
  | string;
