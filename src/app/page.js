import { getEnrichedGames } from "@/lib/mongodb";

export default async function Home() {
  const games = await getEnrichedGames(40);

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Enriched Games (First 40)</h1>
      <hr />
      
      {games.length === 0 ? (
        <p>No games found. Check your connection or database collection name.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
          {games.map((game) => (
            <section 
              key={game._id} 
              style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>{game.name}</h2>
              <p style={{ fontSize: "14px", color: "#555" }}>{game.summary || "No summary available."}</p>
              
              <div style={{ marginTop: "10px" }}>
                <strong>Genres: </strong>
                {game.genres?.map(g => (
                  <span key={g.id} style={{ background: "#eee", padding: "2px 6px", margin: "2px", borderRadius: "4px", fontSize: "12px" }}>
                    {g.name}
                  </span>
                )) || "N/A"}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
