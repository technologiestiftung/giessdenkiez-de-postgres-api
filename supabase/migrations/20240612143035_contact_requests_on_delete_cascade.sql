alter table contact_requests drop constraint contact_requests_user_id_fkey;
alter table contact_requests add constraint contact_requests_user_id_fkey
   foreign key (user_id)
   references auth.users(id)
   on delete cascade;

alter table contact_requests drop constraint contact_requests_contact_id_fkey;
alter table contact_requests add constraint contact_requests_contact_id_fkey
   foreign key (contact_id)
   references auth.users(id)
   on delete cascade;