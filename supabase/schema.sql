-- ==============================================================================
-- DIGEST MEDIA STUDIO DASHBOARD - SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- ==============================================================================
-- This script provisions all tables, indexes, triggers, and Row Level Security
-- (RLS) policies for the Digest Media Dashboard application.
-- Run this script directly in your Supabase project's SQL Editor.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE (Mirrors auth.users with app-specific RBAC roles)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  avatar_url text,
  phone text,
  job_title text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Index on role for fast RBAC checks
create index if not exists idx_profiles_role on public.profiles(role);

-- Helper function to check if current user is admin (avoids RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Trigger to auto-create public.profiles record whenever an auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- 3. CLIENTS TABLE
-- ==============================================================================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  phone text default '+1 (555) 000-0000',
  avatar_url text,
  category text default 'Tech & SaaS',
  status text not null default 'active' check (status in ('active', 'vip', 'trial', 'inactive')),
  retainer numeric(12, 2) default 5000.00 not null,
  accounts_count integer default 1 not null,
  location text default 'New York, USA',
  assigned_manager text default 'Samantha William',
  channels text[] default array['Instagram', 'TikTok'],
  created_by uuid references auth.users(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_clients_assigned_to on public.clients(assigned_to);

-- ==============================================================================
-- 4. ACCOUNTS TABLE (Social & Ads platforms connected to clients)
-- ==============================================================================
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  client_name text,
  platform text not null check (platform in ('instagram', 'tiktok', 'youtube', 'linkedin', 'facebook', 'web')),
  handle text not null,
  followers text default '0',
  engagement text default '0%',
  balance numeric(12, 2) default 0.00 not null,
  status text not null default 'connected' check (status in ('connected', 'action_required', 'syncing')),
  avatar_url text,
  last_sync timestamptz default now() not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null
);

create index if not exists idx_accounts_client_id on public.accounts(client_id);
create index if not exists idx_accounts_user_id on public.accounts(user_id);

-- ==============================================================================
-- 5. TASKS TABLE (Board & Editorial tasks)
-- ==============================================================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  client_name text not null,
  client_id uuid references public.clients(id) on delete set null,
  category text default 'Video Production',
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'review', 'completed')),
  due_date text not null,
  completed boolean default false not null,
  assignee_name text default 'Samantha William',
  assignee_avatar text,
  assignee_role text default 'Creative Lead',
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_assigned_to on public.tasks(assigned_to);

-- ==============================================================================
-- 6. NOTIFICATIONS TABLE
-- ==============================================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  type text not null default 'system' check (type in ('task', 'billing', 'ticket', 'system')),
  unread boolean default true not null,
  link text,
  created_at timestamptz default now() not null
);

create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_unread on public.notifications(unread);

-- ==============================================================================
-- 7. TICKETS TABLE & TICKET MESSAGES
-- ==============================================================================
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text unique not null,
  subject text not null,
  description text not null,
  client_name text not null,
  category text default 'Campaign Creative',
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  user_id uuid references auth.users(id) on delete set null,
  requester_name text not null,
  requester_email text not null,
  requester_avatar text,
  assigned_staff text default 'Samantha W.',
  last_message text,
  replies_count integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_tickets_user_id on public.tickets(user_id);
create index if not exists idx_tickets_status on public.tickets(status);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete cascade not null,
  sender_id uuid references auth.users(id) on delete set null,
  sender_name text not null,
  avatar_url text,
  is_staff boolean default false not null,
  message text not null,
  attachment_url text,
  attachment_name text,
  attachment_size text,
  created_at timestamptz default now() not null
);

create index if not exists idx_ticket_messages_ticket_id on public.ticket_messages(ticket_id);

-- ==============================================================================
-- 8. BALANCE TRANSACTIONS / FINANCES TABLE
-- ==============================================================================
create table if not exists public.balance_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_id text unique not null,
  client_name text not null,
  client_id uuid references public.clients(id) on delete set null,
  amount numeric(12, 2) not null,
  fee numeric(12, 2) default 0.00 not null,
  type text default 'deposit',
  status text not null default 'approved' check (status in ('approved', 'pending', 'rejected', 'paid', 'overdue')),
  payment_method text not null check (payment_method in ('Bank Transfer', 'Credit Card', 'Wire Transfer', 'PayPal')),
  service text default 'Ad Spend Retainer',
  slip_url text,
  user_id uuid references auth.users(id) on delete set null,
  date timestamptz default now() not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_transactions_user_id on public.balance_transactions(user_id);
create index if not exists idx_transactions_status on public.balance_transactions(status);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.accounts enable row level security;
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.balance_transactions enable row level security;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
create policy "Profiles: Users can view own profile or admins view all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Profiles: Users can update own profile or admins update all"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

create policy "Profiles: Admins can insert/delete profiles"
  on public.profiles for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- CLIENTS POLICIES
-- ------------------------------------------------------------------------------
create policy "Clients: Admins have full access"
  on public.clients for all
  using (public.is_admin());

create policy "Clients: Users can view assigned or created clients"
  on public.clients for select
  using (auth.uid() = assigned_to or auth.uid() = created_by);

create policy "Clients: Users can insert their own clients"
  on public.clients for insert
  with check (auth.uid() = created_by);

create policy "Clients: Users can update assigned clients"
  on public.clients for update
  using (auth.uid() = assigned_to or auth.uid() = created_by);

-- ------------------------------------------------------------------------------
-- ACCOUNTS POLICIES
-- ------------------------------------------------------------------------------
create policy "Accounts: Admins have full access"
  on public.accounts for all
  using (public.is_admin());

create policy "Accounts: Users can view their assigned accounts"
  on public.accounts for select
  using (auth.uid() = user_id);

create policy "Accounts: Users can insert their accounts"
  on public.accounts for insert
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- TASKS POLICIES
-- ------------------------------------------------------------------------------
create policy "Tasks: Admins have full access"
  on public.tasks for all
  using (public.is_admin());

create policy "Tasks: Users can view assigned or created tasks"
  on public.tasks for select
  using (auth.uid() = assigned_to or auth.uid() = created_by);

create policy "Tasks: Users can insert tasks"
  on public.tasks for insert
  with check (auth.uid() = created_by);

create policy "Tasks: Users can update tasks assigned to them"
  on public.tasks for update
  using (auth.uid() = assigned_to or auth.uid() = created_by);

-- ------------------------------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ------------------------------------------------------------------------------
create policy "Notifications: Users can manage their own notifications"
  on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Notifications: Admins have full access"
  on public.notifications for all
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- TICKETS & TICKET MESSAGES POLICIES
-- ------------------------------------------------------------------------------
create policy "Tickets: Admins have full access"
  on public.tickets for all
  using (public.is_admin());

create policy "Tickets: Users can view own tickets"
  on public.tickets for select
  using (auth.uid() = user_id);

create policy "Tickets: Users can create tickets"
  on public.tickets for insert
  with check (auth.uid() = user_id);

create policy "Ticket Messages: Admins have full access"
  on public.ticket_messages for all
  using (public.is_admin());

create policy "Ticket Messages: Users can view messages on own tickets"
  on public.ticket_messages for select
  using (
    exists (
      select 1 from public.tickets
      where public.tickets.id = ticket_id and public.tickets.user_id = auth.uid()
    )
  );

create policy "Ticket Messages: Users can post messages on own tickets"
  on public.ticket_messages for insert
  with check (
    exists (
      select 1 from public.tickets
      where public.tickets.id = ticket_id and public.tickets.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- BALANCE TRANSACTIONS POLICIES
-- ------------------------------------------------------------------------------
create policy "Transactions: Admins have full access"
  on public.balance_transactions for all
  using (public.is_admin());

create policy "Transactions: Users can view own transactions"
  on public.balance_transactions for select
  using (auth.uid() = user_id);

create policy "Transactions: Users can submit payment deposits"
  on public.balance_transactions for insert
  with check (auth.uid() = user_id);
