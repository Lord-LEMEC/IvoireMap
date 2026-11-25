-- Suggestions de trajets manquants envoyees par les utilisateurs a l'administrateur
create type route_suggestion_status as enum ('nouveau', 'en_cours', 'ajoute', 'rejete');

create table route_suggestions (
  id uuid primary key default gen_random_uuid(),
  departure text not null,
  destination text not null,
  transport_modes text,
  estimated_price text,
  process_description text not null,
  contact text,
  status route_suggestion_status not null default 'nouveau',
  created_at timestamptz not null default now()
);

alter table route_suggestions enable row level security;

-- Tout visiteur peut proposer un trajet manquant ; lecture reservee aux moderateurs/admins
create policy "route_suggestions_insert_anyone" on route_suggestions for insert with check (true);
create policy "route_suggestions_select_mod" on route_suggestions for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('moderateur', 'administrateur'))
);
