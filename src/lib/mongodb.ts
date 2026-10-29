import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // Fallback promise that rejects with an informative error if URI is missing
  clientPromise = Promise.reject(new Error("MONGODB_URI environment variable is not defined in .env.local"));
}

export default clientPromise;

export async function getDb(dbName = "sazzad_portfolio"): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}

