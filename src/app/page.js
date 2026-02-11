import { getEnrichedGames } from "@/lib/mongodb";
import GameCard from "./components/GameCard/GameCard.js";

export default async function Home() {
  const games = await getEnrichedGames(40);

  return (
  <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto"}}>
      <h1 style={{ marginBottom: "30px" }}>Enriched Collection</h1>
      {games.map((game) => (
        <GameCard key={game._id} game={game} />
      ))}
    </main>
  );
}
