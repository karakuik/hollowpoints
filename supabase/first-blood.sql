create table if not exists public.first_blood_matches (
  match_id text primary key,
  match_data jsonb not null,
  participant_ids text[] not null default '{}',
  game_created_at bigint not null default 0,
  received_at timestamptz not null default now()
);

create index if not exists first_blood_matches_participants_idx
  on public.first_blood_matches using gin (participant_ids);
create index if not exists first_blood_matches_created_idx
  on public.first_blood_matches (game_created_at desc);

alter table public.first_blood_matches enable row level security;
revoke all on public.first_blood_matches from anon, authenticated;
