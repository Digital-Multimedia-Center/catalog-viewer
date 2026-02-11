import { testConnection } from "@/lib/mongodb";

export default async function Home() {
  const isConnected = await testConnection();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Database Status</h1>
      {isConnected ? (
        <p style={{ color: "green" }}>Successfully connected to MongoDB!</p>
      ) : (
        <p style={{ color: "red" }}>Failed to connect to MongoDB.</p>
      )}
    </div>
  );
}
