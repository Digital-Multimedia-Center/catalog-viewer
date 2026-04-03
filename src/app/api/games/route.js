import { getEnrichedGames } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 25;
  const platforms = searchParams.get("platforms")?.split(",").filter(Boolean).map(Number) || [];
  const genres = searchParams.get("genres")?.split(",").filter(Boolean).map(Number) || [];

  const games = await getEnrichedGames(page, limit, platforms, genres);
  return NextResponse.json(games);
}
