CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "extensions";

ALTER TABLE "public"."profiles"
	DROP CONSTRAINT "username_length_constraint";

ALTER TABLE "public"."profiles"
	ALTER COLUMN "username" SET data TYPE citext USING "username"::citext;

ALTER TABLE "public"."profiles"
	ADD CONSTRAINT "username_length_constraint" CHECK (((length((username)::text) >= 3) AND (length((username)::text) <= 50))) NOT valid;

ALTER TABLE "public"."profiles" validate CONSTRAINT "username_length_constraint";

