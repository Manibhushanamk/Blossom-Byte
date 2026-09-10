import mongoose from 'mongoose';
import { getConfig } from './config';

// Global cache to prevent multiple connections during Next.js hot reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const config = getConfig();
  if (!config || !config.dbUri) {
    throw new Error('Database is not configured. Please run the setup wizard.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: config.dbName || 'blossom-byte'
    };

    cached.promise = mongoose.connect(config.dbUri, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
