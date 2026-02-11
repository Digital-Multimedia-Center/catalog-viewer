import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function testConnection() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  } finally {
    await client.close();
  }
}
