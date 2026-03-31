import { getGenres, getPlatforms } from "@/lib/mongodb";
import HomeClient from "./HomeClient";

export default async function Page() {
  const initialGenres = await getGenres();
  const initialPlatforms = await getPlatforms();

  return (
    <HomeClient
      initialGenres={initialGenres}
      initialPlatforms={initialPlatforms}
    />
  );
}
