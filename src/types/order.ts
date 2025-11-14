import type { Product } from './product';

export type EstadoPedido = 'pendiente' | 'comprobante' | 'pagado' | 'rechazado' | 'expirado' | 'cancelado';

export type MetodoPago = 'transferencia' | 'link_externo' | 'otro';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  nombre: string;
  sku: string;
  precio_unitario_usd: number;
  cantidad: number;
  total_item_usd: number;
  product?: Product;
}

export interface ShippingAddress {
  id: string;
  order_id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  whatsapp: string;
  documento: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  referencia: string | null;
}

export interface Order {
  id: string;
  order_code: string;
  user_id: string | null;
  subtotal_usd: number;
  iva_porcentaje: number;
  iva_monto_usd: number;
  costo_envio_usd: number;
  total_usd: number;
  metodo_pago: MetodoPago;
  link_pago_externo: string | null;
  status: EstadoPedido;
  expires_at_utc: string;
  paid_at_utc: string | null;
  created_at_utc: string;
  updated_at_utc: string;
  shipping_address?: ShippingAddress;
  items?: OrderItem[];
}

export interface PaymentReceipt {
  id: string;
  order_id: string;
  metodo: 'transferencia';
  comprobante_url: string;
  estado: 'en_revision' | 'aceptado' | 'rechazado';
  created_at_utc: string;
  updated_at_utc: string;
}
