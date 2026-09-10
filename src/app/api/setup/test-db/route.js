import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    const { uri, dbName } = await req.json();
    
    if (!uri) {
      return NextResponse.json({ success: false, error: 'MongoDB URI is required' }, { status: 400 });
    }

    // Try to connect briefly
    const conn = await mongoose.createConnection(uri, {
      dbName: dbName || undefined,
      serverSelectionTimeoutMS: 5000 // timeout after 5 seconds
    }).asPromise();

    await conn.close();

    return NextResponse.json({ success: true, message: 'Connected successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
