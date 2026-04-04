import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function getEnrichedGames(page = 1, limit = 40, platforms = [], genres = []) {
  try {
    await client.connect();
    const database = client.db("enriched-game-data");
    const collection = database.collection("enriched-items");
    const skipCount = (page - 1) * limit;

    // 1. Initial filter for genres (exists on root document)
    const initialMatch = {};
    if (genres.length > 0) {
      initialMatch["genres.id"] = { $in: genres };
    }

    const pipeline = [
      { $match: initialMatch },
      { $sort: { release_date: -1 } },
      // Note: skip/limit here might be inaccurate if many items
      // are filtered out by the platform check later.
      // For strict accuracy, move skip/limit to the very end.

      {
        $lookup: {
          from: "dmc-items",
          localField: "dmc_entries",
          foreignField: "_id",
          as: "dmc_entries"
        }
      }
    ];

    // 2. Filter by Platform ID inside the joined dmc_entries
    if (platforms.length > 0) {
      pipeline.push({
        $match: {
          "dmc_entries.platform_id_guess": { $in: platforms }
        }
      });
    }

    // 3. Final Pagination
    pipeline.push({ $skip: skipCount });
    pipeline.push({ $limit: limit });

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
