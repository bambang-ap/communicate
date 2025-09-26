import "dotenv/config";

import { createClient } from "@libsql/client";

console.log(process.env)

async function seed() {
	const db = createClient({
		url: process.env.TURSO_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	});

	await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    fromLegacy TEXT,
    created_at TEXT NOT NULL
  )
`);
}

// seed();
