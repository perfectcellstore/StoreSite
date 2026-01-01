import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'perfect_sell';

let cachedClient = null;
let cachedDb = null;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

// Health check to verify connection is alive
async function isConnectionAlive(client) {
  try {
    if (!client) return false;
    await client.db('admin').command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('[DB] Connection health check failed:', error.message);
    return false;
  }
}

// Sleep helper for retry logic
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function connectToDatabase() {
  // Check if cached connection exists and is alive
  if (cachedClient && cachedDb) {
    const isAlive = await isConnectionAlive(cachedClient);
    if (isAlive) {
      console.log('[DB] Using cached connection');
      return { client: cachedClient, db: cachedDb };
    } else {
      console.warn('[DB] Cached connection is stale, reconnecting...');
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Retry logic with exponential backoff
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`[DB] Connection attempt ${attempt}/${MAX_RETRY_ATTEMPTS}...`);
      
      if (!uri) {
        throw new Error('MONGO_URL environment variable is not set');
      }

      const client = await MongoClient.connect(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      const db = client.db(dbName);

      // Verify connection with ping
      await client.db('admin').command({ ping: 1 });
      
      cachedClient = client;
      cachedDb = db;
      connectionAttempts = attempt;

      console.log(`[DB] ✅ Connected successfully on attempt ${attempt}`);
      return { client, db };
      
    } catch (error) {
      lastError = error;
      console.error(`[DB] Connection attempt ${attempt} failed:`, error.message);
      
      if (attempt < MAX_RETRY_ATTEMPTS) {
        const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`[DB] Retrying in ${delayMs}ms...`);
        await sleep(delayMs);
      }
    }
  }

  // All retries failed
  console.error('[DB] ❌ All connection attempts failed');
  throw new Error(`Failed to connect to MongoDB after ${MAX_RETRY_ATTEMPTS} attempts: ${lastError.message}`);
}

export async function getCollection(collectionName) {
  try {
    const { db } = await connectToDatabase();
    return db.collection(collectionName);
  } catch (error) {
    console.error(`[DB] Failed to get collection "${collectionName}":`, error.message);
    throw error;
  }
}

// New: Database health check endpoint
export async function checkDatabaseHealth() {
  try {
    const { client, db } = await connectToDatabase();
    await client.db('admin').command({ ping: 1 });
    const userCount = await db.collection('users').countDocuments();
    return {
      connected: true,
      userCount,
      database: dbName,
      connectionAttempts
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}
