// db.js
import postgres from "postgres";
// This is the local database spawned by supabase
// You should not use your prodction database here. It will inject/remove data
// Therefore this is currently hardcoded to localhost
const url = "postgresql://postgres:postgres@localhost:54322/postgres";

export async function truncateTreesWaterd() {
	const sql = postgres(url);
	await sql`TRUNCATE TABLE trees_watered`;
	sql.end();
}
export async function truncateTreesAdopted() {
	const sql = postgres(url);
	await sql`TRUNCATE TABLE trees_adopted`;
	sql.end();
}

export async function createWateredTrees() {
	const sql = postgres(url);
	await sql`
		INSERT INTO trees_watered (uuid, tree_id, amount, timestamp)
		VALUES
			('test', '_2100294b1f', 1, '2023-01-01 00:00:00'),
			('test', '_2100294b1f', 1, '2023-01-01 00:00:00'),
			('test', '_2100186c08', 1, '2023-01-01 00:00:00'),
			('test', '_2100186c08', 1, '2023-01-01 00:00:00');
			`;
	sql.end();
}
