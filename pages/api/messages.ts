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
			"SELECT * FROM messages ORDER BY created_at DESC LIMIT 10"
		);
		res.status(200).json(messages.rows);
	} else if (req.method === "POST") {
		const { text, username } = req.body;
		const sender = username || req.cookies["username"] || "Anonymous";

		if (!req.cookies["username"] && sender) {
			res.setHeader(
				"Set-Cookie",
				`username=${encodeURIComponent(sender)}; Path=/; Max-Age=${
					60 * 60 * 24 * 30
				}; HttpOnly`
			);
		}

		await db.execute(
			"INSERT INTO messages (text, sender, created_at) VALUES (?, ?, ?)",
			[text, sender, new Date().toISOString()]
		);

		res.redirect("/");
	} else {
		res.status(405).end();
	}
}
