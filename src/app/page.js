import { getEnrichedGames, getGenres, getPlatforms } from "@/lib/mongodb";
import { Input } from "@/components/ui/input"

import { Field, FieldLabel } from "@/components/ui/field"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

import { GameCard } from "./components/GameCard/GameCard.js";
import { LimitSelector } from "./components/LimitSelector/LimitSelector.js";
import { FilterDropdownMenu } from "./components/FilterCheckbox/FilterCheckbox.js";

export default async function Home({ searchParams }) {
  const limitOptions = [25, 50, 100]

  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const limit = Number(resolvedParams?.limit) || limitOptions[0];

  const games = await getEnrichedGames(currentPage, limit);
  const genres = await getGenres();
  const platforms = await getPlatforms();

  const getPageUrl = (pageNumber) => {
    const params = new URLSearchParams(resolvedParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
  <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto"}}>
      <h1 style={{ marginBottom: "30px" }}>Enriched Collection</h1>
      <Input />
      <FilterDropdownMenu items={platforms} category={"Platforms"}/>
      <FilterDropdownMenu items={genres} category={"Genres"}/>

      {games.map((game) => (<GameCard key={game._id} game={game} />))}

      <div className="flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <LimitSelector limit={limit} limitOptions={limitOptions} />
        </Field>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={getPageUrl(Math.max(1, currentPage - 1))} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={getPageUrl(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}
