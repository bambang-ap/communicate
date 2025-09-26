import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { getBaseUrl } from "../src";

type Message = { id: number; text: string; created_at: string };

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	return { props: { baseUrl: getBaseUrl(req) } };
};

export default function Home({ baseUrl }: { baseUrl: string }) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [text, setText] = useState("");

	const load = async () => {
		const res = await fetch(`${baseUrl}/api/messages`);
		setMessages(await res.json());
	};

	useEffect(() => {
		load();
	}, []);

	const send = async () => {
		await fetch(`${baseUrl}/api/messages`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
		});
		setText("");
		load();
	};

	return (
		<div style={{ padding: 20 }}>
			<h1>Pesan untuk Ortu</h1>
			<input value={text} onChange={(e) => setText(e.target.value)} />
			<button onClick={send}>Kirim</button>
			<ul>
				{messages.map((m) => (
					<li key={m.id}>
						{m.created_at}: {m.text}
					</li>
				))}
			</ul>
		</div>
	);
}
