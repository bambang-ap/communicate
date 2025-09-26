import { GetServerSideProps } from "next";
import { getBaseUrl } from "../src";

type Message = { id: number; text: string; created_at: string };

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const res = await fetch(`${getBaseUrl(req)}/api/messages`);
  const messages: Message[] = await res.json();
  return { props: { messages } };
};

export default function Legacy({ messages = [] }: { messages: Message[] }) {
  // Tampilkan pesan terbaru di atas
  const reversed = [...messages].reverse();

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        lineHeight: "1.4",
        padding: "10px",
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
        <input type="hidden" name="fromLegacy" value="true" />
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
        {reversed.map((m) => (
          <li
            key={m.id}
            style={{
              borderBottom: "1px solid #ccc",
              padding: "5px 0",
            }}
          >
            <div>{m.text}</div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              {new Date(m.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
