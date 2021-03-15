# Migration Notes

We used this migration to update the trees with some missing ones and added the new caretaker column o the trees table.

```sql
-- backup trees
CREATE TABLE trees_backup as TABLE trees;

-- create trees_new with updated columns

CREATE VIEW trees_new0 as
SELECT * FROM trees
UNION ALL
SELECT * FROM trees_temp;
CREATE VIEW trees_new1 as
SELECT trees_new0.*, trees_extention."KENNZEICH",trees_extention."STANDORTNR"
FROM trees_new0
LEFT JOIN trees_extention
ON trees_new0.id=trees_extention.id_;
CREATE TABLE trees_new as
SELECT trees_new1.*, trees_watered_batch.username as caretaker
FROM trees_new1
LEFT JOIN trees_watered_batch
ON trees_new1.id=trees_watered_batch.tree_id;
DROP VIEW trees_new1;
DROP VIEW trees_new0;

-- rename columns from uppercase to lowercase on trees_new

ALTER TABLE trees_new RENAME COLUMN "KENNZEICH" TO kennzeich;
ALTER TABLE trees_new RENAME COLUMN "STANDORTNR" TO standortnr;

-- add columns to trees
ALTER TABLE trees ADD COLUMN caretaker text DEFAULT NULL;
ALTER TABLE trees ADD COLUMN kennzeich text DEFAULT NULL;
ALTER TABLE trees ADD COLUMN standortnr text DEFAULT NULL;

-- insert missing and update existing
-- WARNING somehow this swapped the content of caretaker and standortnr
-- ???

INSERT INTO trees
SELECT * FROM trees_new
ON CONFLICT (id)
DO UPDATE SET
		caretaker  = EXCLUDED."caretaker",
		kennzeich  = EXCLUDED."kennzeich",
		standortnr = EXCLUDED."standortnr";


SELECT * FROM trees where caretaker is NOT NULL;
```
