import { MongoClient } from 'mongodb';

// Don't throw error during build time, only at runtime
const uri = process.env.MONGODB_URI || '';
const options = {};

let client;
let clientPromise: Promise<MongoClient> | null = null;

// Only initialize MongoDB client if URI is available
if (uri) {
  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;