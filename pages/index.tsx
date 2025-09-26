import { GetServerSideProps } from "next";
import { createRoot } from "react-dom/client";

type Message = { id: number; text: string; created_at: string };

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || `http://${req.headers.host}`;
	const res = await fetch(`${baseUrl}/api/messages`);
	const messages: Message[] = await res.json();
	return { props: { messages } };
};

export default function Legacy({ messages = [] }: { messages: Message[] }) {

	return (
		<>
			<h3>Pesan Terbaru</h3>
			<ul>
				{messages.map((m) => (
					<li key={m.id}>
						{m.created_at}: {m.text}
					</li>
				))}
			</ul>

			<form method="POST" action="/api/messages">
				<input  style={{display:'none'}} name="fromLegacy" value="true" />
				<input type="text" name="text" />
				<button type="submit">Kirim</button>
			</form>
		</>
	);
}
