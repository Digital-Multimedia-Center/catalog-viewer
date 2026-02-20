import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function getEnrichedGames(limit = 40) {
  try {
    await client.connect();
    const database = client.db("enriched-game-data");
    const collection = database.collection("enriched-items");

    const games = await collection.aggregate([
      // 1. Sort by release date (descending)
      { $sort: { release_date: -1 } },

      // 2. Limit number of documents
      { $limit: limit },

      // 3. Join with dmc-items
      {
        $lookup: {
          from: "dmc-items",          // collection to join
          localField: "dmc_entries",  // array of IDs in enriched-items
          foreignField: "_id",        // matching field in dmc-items
          as: "dmc_entries"           // overwrite with populated docs
        }
      }
    ]).toArray();

    return JSON.parse(JSON.stringify(games));
  } catch (e) {
    console.error(e);
    return [];
  } finally {
    await client.close();
  }
}

export async function getGenres() {
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
          _id: 0,
          id: "$_id",
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



