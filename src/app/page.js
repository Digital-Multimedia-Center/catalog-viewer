import { getEnrichedGames, getGenres, getPlatforms } from "@/lib/mongodb";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import GameCard from "./components/GameCard/GameCard.js";
import {FilterDropdownMenu} from "./components/FilterCheckbox/FilterCheckbox.js";

export default async function Home() {
  const games = await getEnrichedGames(20);
  const genres = await getGenres();
  const platforms = await getPlatforms();

  console.log(genres);

  return (
  <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto"}}>
      <h1 style={{ marginBottom: "30px" }}>Enriched Collection</h1>
      <Input />
      <FilterDropdownMenu items={platforms} category={"Platforms"}/>
      <FilterDropdownMenu items={genres} category={"Genres"}/>
      {games.map((game) => (
        <GameCard key={game._id} game={game} />
      ))}
    </main>
  );
}
