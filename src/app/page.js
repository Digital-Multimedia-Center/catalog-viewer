import { getEnrichedGames, getGenres } from "@/lib/mongodb";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import GameCard from "./components/GameCard/GameCard.js";

export default async function Home() {
  const games = await getEnrichedGames(20);
  const genres = await getGenres();

  return (
  <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto"}}>
      <h1 style={{ marginBottom: "30px" }}>Enriched Collection</h1>
      <Input />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Platform</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Modern</DropdownMenuLabel>
            <DropdownMenuItem>PlayStation 5</DropdownMenuItem>
            <DropdownMenuItem>PlayStation 4</DropdownMenuItem>
            <DropdownMenuItem>Xbox One Series X</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Retro</DropdownMenuLabel>
            <DropdownMenuItem>Nintendo DS</DropdownMenuItem>
            <DropdownMenuItem>PlayStation Portable</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Genres</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Action</DropdownMenuItem>
          <DropdownMenuItem>Adventure</DropdownMenuItem>
          {genres.map((genre) => (
          <DropdownMenuItem key={genre.id}>{genre.name}</DropdownMenuItem>
          )) }
        </DropdownMenuContent>
      </DropdownMenu>
      {games.map((game) => (
        <GameCard key={game._id} game={game} />
      ))}
    </main>
  );
}
