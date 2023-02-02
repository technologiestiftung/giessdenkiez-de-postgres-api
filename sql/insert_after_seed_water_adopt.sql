INSERT INTO "public"."trees_watered" ("time", "uuid", "amount", "timestamp", "username", "tree_id")
	VALUES (CURRENT_TIMESTAMP, 'auth0|abc', 100, CURRENT_TIMESTAMP, 'foo', '_2100294b1f'), (CURRENT_TIMESTAMP, 'auth0|abc', 100, CURRENT_TIMESTAMP, 'foo', '_2100294b1f'), (CURRENT_TIMESTAMP, 'auth0|abc', 100, CURRENT_TIMESTAMP, 'foo', '_21002949fc');

INSERT INTO "public"."trees_adopted" ("uuid", "tree_id")
	VALUES ('auth0|abc', '_21002949fc'), ('auth0|abc', '_2100294b1f');

