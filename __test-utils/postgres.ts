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
	INSERT INTO trees_watered (uuid, amount, timestamp, username, tree_id)
	SELECT
		md5(random()::text),
		random() * 10,
		NOW() - (random() * INTERVAL '7 days'),
		md5(random()::text),
		id
	FROM
		trees
	ORDER BY
		random()
	LIMIT 10;
			`;
	sql.end();
}

export async function deleteSupabaseUser(email: string): Promise<void> {
	const sql = postgres(url);
	await sql`DELETE FROM auth.users WHERE email = ${email}`;
	sql.end();
}
