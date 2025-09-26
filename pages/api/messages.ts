import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@libsql/client";

const db = createClient({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		const messages = await db.execute(
			"SELECT * FROM messages ORDER BY created_at DESC LIMIT 50"
		);
		res.status(200).json(messages.rows);
	} else if (req.method === "POST") {
		const { text, fromLegacy } = req.body;
		await db.execute(
			"INSERT INTO messages (text, fromLegacy, created_at) VALUES (?, ?, ?)",
			[text, fromLegacy, new Date().toISOString()]
		);

		if (fromLegacy === "true") {
			res.redirect("/");
		}

		res.status(200).json({ success: true });
	} else {
		res.status(405).end();
	}
}
