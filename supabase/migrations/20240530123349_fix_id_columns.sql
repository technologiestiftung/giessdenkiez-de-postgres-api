UPDATE trees_watered SET tree_id = (SELECT gml_id FROM trees WHERE trees.id = trees_watered.tree_id);
UPDATE trees_adopted SET tree_id = (SELECT gml_id FROM trees WHERE trees.id = trees_adopted.tree_id);

UPDATE trees SET id = gml_id;
ALTER TABLE trees DROP COLUMN gml_id;