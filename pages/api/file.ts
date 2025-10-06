// pages/api/download.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { name } = req.query;

	let filePath = "";
	let mimeType = "";
	let fileName = "";

	if (name === "1") {
		filePath = path.join(process.cwd(), "public", "pdf.pdf");
		mimeType = "application/pdf";
		fileName = "sample.pdf";
	} else if (name === "2") {
		filePath = path.join(process.cwd(), "public", "text.txt");
		mimeType = "text/plain";
		fileName = "sample.txt";
	}

	if (!fs.existsSync(filePath)) {
		res.status(404).send("File not found");
		return;
	}

	res.setHeader("Content-Type", mimeType);
	res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

	// gunakan stream agar efisien dan langsung dikirim ke browser
	const fileStream = fs.createReadStream(filePath);
	fileStream.pipe(res);
}
