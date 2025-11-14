import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatearPrecio = (valor: number) =>
  new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(valor || 0);

export const formatearFecha = (fechaIso: string) => {
  try {
    return format(parseISO(fechaIso), "d 'de' MMMM yyyy", { locale: es });
  } catch (error) {
    return fechaIso;
  }
};

export const calcularDescuento = (original: number, promo?: number | null) => {
  if (!promo || promo <= 0 || promo >= original) return 0;
  return Math.round((1 - promo / original) * 100);
};
