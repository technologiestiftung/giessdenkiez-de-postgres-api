alter table "public"."trees_watered" alter column "amount" set not null;

alter table "public"."trees_watered" alter column "time" drop not null;

alter table "public"."trees_watered" alter column "timestamp" set not null;


