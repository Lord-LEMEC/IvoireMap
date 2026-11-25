-- IvoireMap - Schema initial Supabase / PostgreSQL
-- Correspond a la section 8.1 du cahier des charges (BaaS: Supabase, BDD: PostgreSQL + SQL)
-- PostGIS est prevu en complement (cf. remarque section 8.1) pour les requetes geospatiales avancees.

create extension if not exists "pgcrypto";
-- create extension if not exists "postgis"; -- a activer quand les requetes geospatiales (rayon, itineraires) seront necessaires

-- ========================================================================
-- PROFILS UTILISATEURS (lie a auth.users de Supabase Auth)
-- ========================================================================
create type user_role as enum ('visiteur', 'utilisateur', 'contributeur_verifie', 'moderateur', 'administrateur');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'utilisateur',
  display_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- Cree automatiquement un profil a l'inscription
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================================================
-- LIEUX (equivalent de PLACES dans data.js)
-- ========================================================================
create type place_status as enum ('actif', 'signale', 'ferme', 'en_attente');

create table places (
  id text primary key, -- conserve les ids lisibles existants (ex: 'yop_siporex')
  name text not null,
  aliases text[] not null default '{}',
  commune text not null,
  category text not null,
  category_name text,
  lat double precision not null,
  lng double precision not null,
  popular_description text,
  landmark text,
  status place_status not null default 'actif',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_places_commune on places (commune);
create index idx_places_category on places (category);
-- Recherche plein texte (nom + alias + commune), utilisee par l'autocompletion
-- array_to_string() etant STABLE en PostgreSQL, on l'encapsule dans une fonction IMMUTABLE pour l'index GIN
create or replace function public.places_search_tsv(p_name text, p_commune text, p_aliases text[])
returns tsvector
language sql
immutable
as $$
  select to_tsvector('french', p_name || ' ' || p_commune || ' ' || coalesce(array_to_string(p_aliases, ' '), ''));
$$;

create index idx_places_search on places using gin (
  public.places_search_tsv(name, commune, aliases)
);

-- ========================================================================
-- RESEAU DE TRANSPORT (equivalent de TRANSPORT_EDGES dans data.js)
-- ========================================================================
create type transport_mode as enum ('gbaka', 'waren', 'sotra', 'walk');

create table transport_edges (
  id text primary key,
  from_place text not null references places (id) on delete cascade,
  to_place text not null references places (id) on delete cascade,
  bidirectional boolean not null default true,
  mode transport_mode not null,
  duration_minutes integer not null check (duration_minutes >= 0),
  price_fcfa integer not null check (price_fcfa >= 0),
  line text,
  instructions text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_edges_from on transport_edges (from_place);
create index idx_edges_to on transport_edges (to_place);

-- Historique des changements de prix (section 4.6 du cahier des charges)
create table price_history (
  id uuid primary key default gen_random_uuid(),
  edge_id text not null references transport_edges (id) on delete cascade,
  old_price_fcfa integer not null,
  new_price_fcfa integer not null,
  changed_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ========================================================================
-- FAVORIS (domicile, travail, ecole...)
-- ========================================================================
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  place_id text not null references places (id) on delete cascade,
  label text not null,
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

-- ========================================================================
-- SIGNALEMENTS (lieu ferme/deplace/mal nomme, prix incorrect...)
-- ========================================================================
create type report_issue_type as enum ('ferme', 'deplace', 'mal_positionne', 'mal_nomme', 'prix_incorrect', 'autre');
create type report_status as enum ('ouvert', 'en_cours', 'resolu', 'rejete');

create table place_reports (
  id uuid primary key default gen_random_uuid(),
  place_id text references places (id) on delete set null,
  place_name text not null,
  issue_type report_issue_type not null,
  message text not null,
  reported_by uuid references profiles (id) on delete set null,
  status report_status not null default 'ouvert',
  created_at timestamptz not null default now()
);

-- ========================================================================
-- AVIS / COMMENTAIRES sur les lieux
-- ========================================================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  place_id text not null references places (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ========================================================================
-- RLS (Row Level Security)
-- ========================================================================
alter table profiles enable row level security;
alter table places enable row level security;
alter table transport_edges enable row level security;
alter table favorites enable row level security;
alter table place_reports enable row level security;
alter table reviews enable row level security;

-- Profils : chacun voit/modifie le sien
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Lieux & reseau de transport : lecture publique, ecriture reservee aux contributeurs connectes
create policy "places_public_read" on places for select using (true);
create policy "places_insert_authenticated" on places for insert with check (auth.uid() is not null);
create policy "places_update_own_or_mod" on places for update using (
  auth.uid() = created_by
  or exists (select 1 from profiles where id = auth.uid() and role in ('moderateur', 'administrateur'))
);

create policy "edges_public_read" on transport_edges for select using (true);
create policy "edges_insert_authenticated" on transport_edges for insert with check (auth.uid() is not null);

-- Favoris : strictement prives
create policy "favorites_owner_all" on favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Signalements : tout le monde peut en creer, seul l'auteur ou un moderateur peut lire les siens
create policy "reports_insert_anyone" on place_reports for insert with check (true);
create policy "reports_select_own_or_mod" on place_reports for select using (
  auth.uid() = reported_by
  or exists (select 1 from profiles where id = auth.uid() and role in ('moderateur', 'administrateur'))
);

-- Avis : lecture publique, ecriture par l'auteur connecte
create policy "reviews_public_read" on reviews for select using (true);
create policy "reviews_insert_own" on reviews for insert with check (auth.uid() = user_id);
create policy "reviews_update_own" on reviews for update using (auth.uid() = user_id);
