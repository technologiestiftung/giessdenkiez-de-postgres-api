// db.js
import postgres from "postgres";
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
