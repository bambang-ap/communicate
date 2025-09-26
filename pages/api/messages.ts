import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data.json");

function readMessages() {
	if (!fs.existsSync(filePath)) return [];
	const raw = fs.readFileSync(filePath, "utf-8");
	return raw ? JSON.parse(raw) : [];
}

function writeMessages(messages: any[]) {
	fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const messages = readMessages();
		res.status(200).json(messages.reverse());
	} else if (req.method === "POST") {
		const { text, fromLegacy } = req.body || {};

		if (!text) return res.status(400).json({ error: "Text is required" });

		const messages = readMessages();
		const msg = {
			text,
			fromLegacy,
			id: Date.now(),
			created_at: new Date().toISOString(),
		};
		messages.push(msg);
		writeMessages(messages);

		if (fromLegacy === "true") {
			res.redirect("/legacy");
		}

		res.status(200).json(msg);
	} else {
		res.status(405).end();
	}
}
