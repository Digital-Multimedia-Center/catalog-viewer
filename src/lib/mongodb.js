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

