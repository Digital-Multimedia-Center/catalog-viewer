"use client"

import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button.jsx"

import { GameCard } from "./components/GameCard/GameCard.js";
import { LimitSelector } from "./components/LimitSelector/LimitSelector.js";
import { FilterDropdownMenu } from "./components/FilterCheckbox/FilterCheckbox.js";

export default function Home({ initialGenres, initialPlatforms }) {
  const limitOptions = [25, 50, 100]

  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [filters, setFilters] = useState({ Platforms: [], Genres: [] });
  const [appliedFilters, setAppliedFilters] = useState({ Platforms: [], Genres: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        const query = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          search: appliedSearch,
          platforms: appliedFilters.Platforms.join(","),
          genres: appliedFilters.Genres.join(",")
        });

        try {
          const res = await fetch(`/api/games?${query}`);
          const data = await res.json();
          setGames(data);
        } catch (error) {
          console.error("Failed to fetch games:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [page, limit, appliedFilters, appliedSearch]);

  const handleFilterChange = (category, selectedIds) => {
    setFilters(prev => ({ ...prev, [category]: selectedIds }));
  };

  const handleApply = () => {
    setAppliedFilters(filters);
    setAppliedSearch(searchTerm);
    setPage(1);
  };

  return (
  <main style={{ padding: "40px", maxWidth: "75%", margin: "0 auto"}}>
      <h1 style={{ marginBottom: "30px" }}>Enriched Collection</h1>
      <Input
        placeholder="Search titles..."
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FilterDropdownMenu
        items={initialPlatforms}
        category={"Platforms"}
        selected={filters.Platforms}
        onSelectionChange={(ids) => handleFilterChange("Platforms", ids)}
      />
      <FilterDropdownMenu
        items={initialGenres}
        category={"Genres"}
        selected={filters.Genres}
        onSelectionChange={(ids) => handleFilterChange("Genres", ids)}
      />
      <Button onClick={handleApply}>
          Apply Filters
      </Button>

      {games.map((game) => (<GameCard key={game._id} game={game} allPlatforms={initialPlatforms} />))}

      <div className="flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <LimitSelector
            limit={limit}
            limitOptions={limitOptions}
            onLimitChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          />
        </Field>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            <PaginationItem className="px-4 text-sm font-medium"> Page {page} </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => setPage((p) => p + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}
