import Image from "next/image";

export default function GameCard({ game }) {
  // Convert Unix timestamp to readable date
  const releaseDate = game.release_date 
    ? new Date(game.release_date * 1000).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : "TBD";

  // Construct the IGDB cover URL
  const coverUrl = game.cover?.image_id 
    ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
    : "/api/placeholder/400/600"; // Fallback placeholder

  return (
    <div style={{
      display: "flex",
      gap: "20px",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "20px",
      overflow: "hidden"
    }}>
      {/* Game Cover */}
      <div style={{ flexShrink: 0 }}>
      <Image 
        src={coverUrl} 
        alt={`${game.name} cover`}
        width={150}
        height={200}
        style={{ 
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          objectFit: "cover"
        }} 
        priority={false}
      />
      </div>

      {/* Game Details */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h2 style={{ margin: "0 0 5px 0", fontSize: "1.5rem" }}>{game.name}</h2>
          <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
            ID: {game._id}
          </span>
        </div>

        <p style={{ margin: "0 0 10px 0", fontWeight: "600" }}>
          Released: {releaseDate}
        </p>

        {/* Genres */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px" }}>
          {game.genres?.map((genre) => (
            <span key={genre.id} style={{
              backgroundColor: "#D3D3D3",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              textTransform: "uppercase"
            }}>
              {genre.name}
            </span>
          ))}
        </div>

        {/* Summary */}
        <p style={{ 
          fontSize: "0.95rem", 
          lineHeight: "1.5", 
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical"
        }}>
          {game.summary || "No description provided."}
        </p>

        {/* Metadata Footer */}
        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #333", fontSize: "0.8rem" }}>
          <span>
            Source Entries:{" "}
            {game.dmc_entries?.length
              ? [
                ...new Set(
                  game.dmc_entries.flatMap(entry =>
                    (entry.platform_id_guess || [])
                    .filter(p => p && p !== -1)
                    .map(p => p.name)
                  )
                )
              ].join(", ")
              : "None"}
          </span>
          <span style={{ margin: "0 10px" }}>|</span>
          <span>Game Type: {game.game_type}</span>
        </div>
      </div>
    </div>
  );
}
