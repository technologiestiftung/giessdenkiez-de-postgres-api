ALTER TABLE "public"."profiles"
	ADD CONSTRAINT "fk_users_profiles" FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."profiles" validate CONSTRAINT "fk_users_profiles";

