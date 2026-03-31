import { getEnrichedGames, getGenres, getPlatforms } from "@/lib/mongodb";
import { Input } from "@/components/ui/input"

import { Field, FieldLabel } from "@/components/ui/field"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import GameCard from "./components/GameCard/GameCard.js";
import { FilterDropdownMenu } from "./components/FilterCheckbox/FilterCheckbox.js";

export default async function Home() {
  const games = await getEnrichedGames(3, 25);
  const genres = await getGenres();
  const platforms = await getPlatforms();

  return (
  <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto"}}>
      <h1 style={{ marginBottom: "30px" }}>Enriched Collection</h1>
      <Input />
      <FilterDropdownMenu items={platforms} category={"Platforms"}/>
      <FilterDropdownMenu items={genres} category={"Genres"}/>
      {games.map((game) => (
        <GameCard key={game._id} game={game} />
      ))}

      <div className="flex items-center justify-between gap-4">
            <Field orientation="horizontal" className="w-fit">
              <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
              <Select defaultValue="25">
                <SelectTrigger className="w-20" id="select-rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
    </main>
  );
}
