-- Esquema base para Second Round
-- Ejecuta este script en tu proyecto de Supabase (SQL editor)

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  apellido text not null,
  telefono text,
  whatsapp text,
  documento text,
  rol text not null default 'CLIENTE' check (rol in ('ADMIN','SUBADMIN','VENTAS','BODEGA','CLIENTE')),
  created_at_utc timestamptz not null default timezone('utc', now()),
  updated_at_utc timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

create policy "Perfiles propios" on public.profiles
  for select using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Perfiles admin" on public.profiles
  for select to authenticated using (exists (
    select 1 from public.profiles p where p.user_id = auth.uid() and p.rol in ('ADMIN','SUBADMIN')
  ));

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete cascade,
  nivel int not null default 0,
  created_at_utc timestamptz not null default timezone('utc', now()),
  updated_at_utc timestamptz not null default timezone('utc', now())
);

alter table public.categories enable row level security;

create policy "Categorias visibles" on public.categories for select using (true);
create policy "Categorias admin" on public.categories for all to authenticated using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.rol in ('ADMIN','SUBADMIN','BODEGA'))
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  nombre text not null,
  descripcion text not null,
  categoria_id uuid references public.categories(id) on delete set null,
  condicion text not null check (condicion in ('Nuevo','Casi nuevo','Usado','Con detalles')),
  precio_original_usd numeric(12,2) not null,
  precio_promocional_usd numeric(12,2),
  en_promocion boolean not null default false,
  promo_inicio_utc timestamptz,
  promo_fin_utc timestamptz,
  stock int not null default 0,
  sku text not null,
  imagenes text[] default array[]::text[],
  destacado boolean not null default false,
  activo boolean not null default true,
  tallas text,
  medidas text,
  created_at_utc timestamptz not null default timezone('utc', now()),
  updated_at_utc timestamptz not null default timezone('utc', now())
);

alter table public.products enable row level security;

create policy "Productos públicos" on public.products for select using (activo = true);
create policy "Productos admin" on public.products for all to authenticated using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.rol in ('ADMIN','SUBADMIN','BODEGA'))
);

create table if not exists public.settings (
  id uuid primary key default uuid_generate_v4(),
  clave text unique not null,
  valor_json jsonb not null,
  created_at_utc timestamptz not null default timezone('utc', now()),
  updated_at_utc timestamptz not null default timezone('utc', now())
);

alter table public.settings enable row level security;
create policy "Settings lectura" on public.settings for select using (true);
create policy "Settings admin" on public.settings for all to authenticated using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.rol in ('ADMIN','SUBADMIN'))
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_code text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  subtotal_usd numeric(12,2) not null,
  iva_porcentaje numeric(5,2) not null,
  iva_monto_usd numeric(12,2) not null,
  costo_envio_usd numeric(12,2) not null default 0,
  total_usd numeric(12,2) not null,
  metodo_pago text not null check (metodo_pago in ('transferencia','link_externo','otro')),
  link_pago_externo text,
  status text not null check (status in ('pendiente','comprobante','pagado','rechazado','expirado','cancelado')),
  expires_at_utc timestamptz,
  paid_at_utc timestamptz,
  created_at_utc timestamptz not null default timezone('utc', now()),
  updated_at_utc timestamptz not null default timezone('utc', now())
);

alter table public.orders enable row level security;

create policy "Pedidos propios" on public.orders for select using (auth.uid() = user_id);
create policy "Pedidos internos" on public.orders for all to authenticated using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.rol in ('ADMIN','SUBADMIN','VENTAS','BODEGA'))
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  nombre text not null,
  sku text,
  precio_unitario_usd numeric(12,2) not null,
  cantidad int not null,
  total_item_usd numeric(12,2) not null
);

alter table public.order_items enable row level security;
create policy "Items pedidos" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or exists (
    select 1 from public.profiles p where p.user_id = auth.uid() and p.rol in ('ADMIN','SUBADMIN','VENTAS','BODEGA')
  )))
);

create table if not exists public.shipping_addresses (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  nombre text not null,
  apellido text not null,
  email text not null,
  telefono text not null,
  whatsapp text,
  documento text,
  direccion text not null,
  ciudad text not null,
  provincia text not null,
  referencia text
);

alter table public.shipping_addresses enable row level security;
create policy "Direcciones pedidos" on public.shipping_addresses for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or exists (
    select 1 from public.profiles p where p.user_id = auth.uid() and p.rol in ('ADMIN','SUBADMIN','VENTAS','BODEGA')
  )))
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  metodo text not null,
  comprobante_url text not null,
  estado text not null check (estado in ('en_revision','aceptado','rechazado')),
  created_at_utc timestamptz not null default timezone('utc', now()),
  updated_at_utc timestamptz not null default timezone('utc', now())
);

alter table public.payments enable row level security;
create policy "Pagos propios" on public.payments for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "Pagos internos" on public.payments for all to authenticated using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.rol in ('ADMIN','SUBADMIN','VENTAS','BODEGA'))
);

create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  titulo text not null,
  contenido text not null,
  publicado boolean not null default false,
  created_at_utc timestamptz not null default timezone('utc', now()),
  updated_at_utc timestamptz not null default timezone('utc', now())
);

alter table public.blog_posts enable row level security;
create policy "Blog publico" on public.blog_posts for select using (publicado = true);
create policy "Blog internos" on public.blog_posts for all to authenticated using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.rol in ('ADMIN','SUBADMIN'))
);

create table if not exists public.wishlists (
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at_utc timestamptz not null default timezone('utc', now()),
  primary key (user_id, product_id)
);

alter table public.wishlists enable row level security;
create policy "Wishlist propia" on public.wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Bucket privado para comprobantes
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false)
  on conflict do nothing;

-- Política para permitir carga de comprobantes al dueño del pedido
create policy "upload receipts" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'receipts'
  );

create policy "select receipts" on storage.objects
  for select to authenticated using (bucket_id = 'receipts');
