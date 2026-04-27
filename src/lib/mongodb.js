import { MongoClient, ServerApiVersion } from 'mongodb';

export const dynamic = 'force-dynamic';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function getEnrichedGames(page = 1, limit = 40, platforms = [], genres = [], searchTerm = "") {
  /*
  This function is used to filter the database and return the matches with pagination.

  page (int) : integer starting at 1 indicating pagination state
  limit (int) : used with page to determine how many items to skip (page - 1) * limit = skipCount
  platforms (list of ints) : platform ids, filtered with "OR". i.e platform 1 OR platform 2, not platform 1 AND platform 2
  genres (list of ints) : genre ids also filtered by "OR"
  searchTerm (str) : match searchTerm to game titles
  */
  try {
    await client.connect();
    const database = client.db("enriched-game-data");
    const collection = database.collection("enriched-items");
    const skipCount = (page - 1) * limit;

    const initialMatch = {};

    if (searchTerm) initialMatch.name = { $regex: searchTerm, $options: "i" };

    if (genres.length > 0) initialMatch["genres.id"] = { $in: genres };


    const pipeline = [
      { $match: initialMatch },
      {
        $lookup: {
          from: "dmc-items",
          localField: "dmc_entries",
          foreignField: "_id",
          as: "dmc_entries"
        }
      }
    ];

    if (platforms.length > 0) {
      pipeline.push({
        $match: { "dmc_entries.platform_id_guess": { $in: platforms } }
      });
    }

    pipeline.push(
      { $sort: { release_date: -1 } },
      { $skip: skipCount },
      { $limit: limit }
    )

    const games = await collection.aggregate(pipeline).toArray();
    return JSON.parse(JSON.stringify(games));
  } catch (e) {
    console.error(e);
    return [];
  } finally {
    await client.close();
  }
}

export async function getGenres() {
  /*
  Dynamically queries every genre in our enriched-items mongodb collection. If new genres are added or removed, we can dynamically fetch
  */
  try {
    await client.connect();
    const database = client.db("enriched-game-data");
    const collection = database.collection("enriched-items");

    const genres = await collection.aggregate([
      // 1. Flatten the genres array from all documents
      { $unwind: "$genres" },

      // 2. Group by the genre ID to get unique entries
      {
        $group: {
          _id: "$genres.id",
          name: { $first: "$genres.name" }
        }
      },

      // 3. Sort alphabetically by name
      { $sort: { name: 1 } },

      // 4. Project into a clean format for your dropdown
      {
        $project: {
          _id: 1,
          name: 1
        }
      }
    ]).toArray();

    return JSON.parse(JSON.stringify(genres));
  } catch (e) {
    console.error("Error fetching genres:", e);
    return [];
  } finally {
    // Note: In a Next.js environment, frequent closing/opening
    // of connections can be slow. Consider a global connection pattern.
    await client.close();
  }
}

export async function getPlatforms() {
  /*
  Dynamically queries platforms in our enriched-items mongodb collection. If new platforms are added or removed, we can dynamically fetch
  */
  try {
    await client.connect();
    const database = client.db("enriched-game-data");
    const collection = database.collection("platform-data");

    const platforms = await collection.aggregate([
      {
       $project: {
       _id: 1,
       name: 1,
       created_at: 1
       }
      },
      {
        $sort : {created_at: 1}
      }
    ]).toArray();

    return JSON.parse(JSON.stringify(platforms));
  } catch (e) {
    console.error("Error fetching platforms:", e);
    return [];
  } finally {
    // Note: In a Next.js environment, frequent closing/opening
    // of connections can be slow. Consider a global connection pattern.
    await client.close();
  }
}
