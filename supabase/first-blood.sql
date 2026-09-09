create table if not exists public.first_blood_matches (
  match_id text primary key,
  match_data jsonb not null,
  participant_ids text[] not null default '{}',
  uploader_ids uuid[] not null default '{}',
  game_created_at bigint not null default 0,
  received_at timestamptz not null default now()
);

alter table public.first_blood_matches
  add column if not exists uploader_ids uuid[] not null default '{}';

create extension if not exists pgcrypto;

create table if not exists public.first_blood_uploaders (
  id uuid primary key default gen_random_uuid(),
  install_id uuid not null unique,
  label text not null check (char_length(label) between 1 and 80),
  token_hash text not null unique check (char_length(token_hash) = 64),
  enrolled_at timestamptz not null default now(),
  last_seen_at timestamptz,
  revoked_at timestamptz
);

create table if not exists public.first_blood_upload_receipts (
  match_id text not null references public.first_blood_matches(match_id) on delete cascade,
  uploader_id uuid not null references public.first_blood_uploaders(id) on delete cascade,
  payload_hash text not null check (char_length(payload_hash) = 64),
  received_at timestamptz not null default now(),
  primary key (match_id, uploader_id)
);

create table if not exists public.first_blood_rate_limits (
  bucket text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0
);

create or replace function public.first_blood_take_rate_limit(
  p_bucket text,
  p_maximum integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed boolean;
begin
  insert into public.first_blood_rate_limits as limits (bucket, window_started_at, request_count)
  values (p_bucket, now(), 1)
  on conflict (bucket) do update set
    window_started_at = case
      when limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
      else limits.window_started_at
    end,
    request_count = case
      when limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
      else limits.request_count + 1
    end
  returning request_count <= p_maximum into allowed;
  return allowed;
end;
$$;

create index if not exists first_blood_matches_participants_idx
  on public.first_blood_matches using gin (participant_ids);
create index if not exists first_blood_matches_created_idx
  on public.first_blood_matches (game_created_at desc);

alter table public.first_blood_matches enable row level security;
alter table public.first_blood_uploaders enable row level security;
alter table public.first_blood_upload_receipts enable row level security;
alter table public.first_blood_rate_limits enable row level security;

revoke all on public.first_blood_matches, public.first_blood_uploaders,
  public.first_blood_upload_receipts, public.first_blood_rate_limits
  from anon, authenticated;
revoke execute on function public.first_blood_take_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.first_blood_take_rate_limit(text, integer, integer) to service_role;
