# Second Round – Tienda de segunda mano en Ecuador

Proyecto completo de ecommerce construido con React 18, Vite y Supabase para la tienda de segunda mano **Second Round**.
Todo el contenido está en español neutro orientado al contexto ecuatoriano.

## 1. Requisitos previos

- Node.js 18 o superior.
- Cuenta activa en [Supabase](https://supabase.com/).

## 2. Instalación

```bash
npm install
```

Para ejecutar en modo desarrollo:

```bash
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173` por defecto.

## 3. Configuración de Supabase

1. Crea un nuevo proyecto en Supabase.
2. En el panel SQL ejecuta el archivo [`supabase/schema.sql`](supabase/schema.sql) para crear tablas, políticas y buckets necesarios.
3. En Storage crea (si no existe) el bucket privado `receipts` para almacenar comprobantes.
4. En la sección Authentication configura los correos de redirección y habilita el restablecimiento de contraseña.

### Variables de entorno

Copia el archivo `.env.example` y renómbralo a `.env`.

```bash
cp .env.example .env
```

Completa los valores de `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con las credenciales del proyecto. Ajusta los datos bancarios y enlaces según corresponda.

## 4. Scripts disponibles

- `npm run dev`: ejecuta el proyecto en modo desarrollo.
- `npm run build`: genera la versión de producción.
- `npm run preview`: sirve el build generado para revisión.
- `npm run lint`: verifica tipos con TypeScript.

## 5. Flujo principal

1. Los clientes navegan el catálogo, añaden productos al carrito y completan el checkout con datos de envío y transferencia bancaria.
2. Cada pedido genera un código tipo `SR-AAAAMMDD-XXXX` y queda en estado `pendiente` hasta recibir el comprobante.
3. Desde "Mis pedidos" los clientes pueden subir el comprobante, revisar estados y acceder a enlaces de pago externo si existen.
4. El panel `/admin` permite al equipo gestionar productos, categorías, pedidos, clientes, blog, páginas estáticas, configuración (IVA, datos bancarios) y exportar reportes CSV.

## 6. Roles y permisos

- `CLIENTE`: accede a catálogo, checkout, wishlist y pedidos propios.
- `VENTAS`: puede ver y gestionar pedidos desde el panel.
- `BODEGA`: administra inventario y categorías.
- `SUBADMIN`: gestiona casi todas las áreas excepto IVA y configuraciones sensibles.
- `ADMIN`: acceso total al panel, configuración de IVA, datos bancarios y webhook de Qabum.

## 7. Notificaciones y Qabum

- Las funciones `enviarCorreoPedidoCreado` y `enviarCorreoPedidoPagado` están preparadas como stubs para conectar un proveedor de email.
- `notificarQabum` envía la información del pedido pagado al webhook configurado (`QABUM_WEBHOOK_URL`) cuando `QABUM_ENABLED=true`.

## 8. Construcción para producción

```bash
npm run build
npm run preview
```

## 9. Textos legales

Las páginas de términos, privacidad y cambios/devoluciones incluidas son modelos orientativos. Deben revisarse y ajustarse con un abogado ecuatoriano antes de su publicación definitiva.

## 10. Contacto

Para soporte del proyecto escribe a hola@secondround.ec.
