import { GetServerSideProps } from "next";
import { getBaseUrl } from "../src";
import { createClient } from "@libsql/client";

type Message = { id: number; text: string; sender: string; created_at: string };

async function seed() {
	const db = createClient({
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN,
	});

	await db.execute(`
    DROP TABLE messages`);
	await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      sender TEXT,
      created_at TEXT NOT NULL
    );
  `);

	return { props: {} };
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	// return seed();

	const cookies = req.headers.cookie || "";

	const usernameMatch = cookies.match(/username=([^;]+)/);
	const username = usernameMatch ? decodeURIComponent(usernameMatch[1]) : "";

	const res = await fetch(`${getBaseUrl(req)}/api/messages`);
	const messages: Message[] = await res.json();

	return { props: { messages, username } };
};

export default function Legacy({
	messages = [],
	username,
}: {
	messages: Message[];
	username: string;
}) {
	return (
		<div
			style={{
				maxWidth: "400px",
				margin: "0 auto",
				fontFamily: "Arial, sans-serif",
				fontSize: "14px",
				lineHeight: "1.4",
				padding: "4px",
			}}
		>
			{/* Form input di atas */}
			<form
				method="POST"
				action="/api/messages"
				style={{
					display: "flex",
					flexDirection: "column",
					marginBottom: "15px",
				}}
			>
				<input
					required
					type={!!username ? "hidden" : "text"}
					name="username"
					placeholder="Nama Anda"
					defaultValue={username}
					style={{ padding: "8px", marginBottom: "5px", fontSize: "14px" }}
				/>

				<input
					type="text"
					name="text"
					placeholder="Tulis pesan..."
					style={{
						padding: "8px",
						marginBottom: "5px",
						fontSize: "14px",
					}}
				/>
				<button
					type="submit"
					style={{
						padding: "8px",
						fontSize: "14px",
						backgroundColor: "#0070f3",
						color: "#fff",
						border: "none",
					}}
				>
					Kirim
				</button>
			</form>

			<h3 style={{ margin: "0 0 10px 0" }}>Pesan Terbaru</h3>
			<ul style={{ listStyle: "none", padding: 0 }}>
				{messages.map((m) => (
					<li
						key={m.id}
						style={{ borderBottom: "1px solid #ccc", padding: "5px 0" }}
					>
						<div>{m.text}</div>
						<div>{m.sender}</div>
						<div style={{ fontSize: "8px" }}>
							{new Date(m.created_at).toLocaleString("id")}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
