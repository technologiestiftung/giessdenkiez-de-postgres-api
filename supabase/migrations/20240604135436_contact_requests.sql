create table contact_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  contact_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  contact_message text,
  contact_mail_id text default null, -- the resend.io ID of the sent contact mail
  confirmation_mail_id text default null, -- the resend.io ID of the sent confirmation mail
  confirmated_at timestamp with time zone default null,
  rejected_at timestamp with time zone default null
);

alter table "public"."contact_requests" enable row level security;

create policy "Authenticated users can insert their own contact requests"
on contact_requests
for insert to authenticated
with check (auth.uid() = user_id);

create policy "Authenticated users can select their own contact requests"
on contact_requests
for select to authenticated
using (auth.uid() = user_id or auth.uid() = contact_id);

create policy "Authenticated users can delete their own contact requests"
on contact_requests
for delete to authenticated
using (auth.uid() = user_id);

create policy "Authenticated users can update their own contact requests"
on contact_requests
for select to authenticated
using (auth.uid() = user_id or auth.uid() = contact_id);

-- not possible to set RLS on views
create view public.users_view as select * from auth.users;