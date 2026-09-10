import { NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/config';
import mongoose from 'mongoose';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  const config = getConfig();
  // Never expose full password in URI to frontend for security
  const maskedUri = config?.dbUri ? config.dbUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : '';
  
  return NextResponse.json({ success: true, uri: maskedUri, dbName: config?.dbName || '' });
}

export async function POST(req) {
  try {
    const { action, dbConfig, adminUser } = await req.json();

    if (action === 'test') {
      const conn = await mongoose.createConnection(dbConfig.uri, { 
        dbName: dbConfig.dbName, 
        serverSelectionTimeoutMS: 5000 
      }).asPromise();
      await conn.close();
      return NextResponse.json({ success: true, message: 'Connection successful' });
    }

    if (action === 'switch') {
      // Cleanly disconnect from old database
      if (mongoose.connection.readyState === 1) {
         await mongoose.disconnect();
      }
      // Reset Next.js cache
      global.mongoose = { conn: null, promise: null };
      
      // Save new configuration locally
      saveConfig({ dbUri: dbConfig.uri, dbName: dbConfig.dbName });
      
      // If adminUser was provided, it means they want to auto-initialize the new DB
      if (adminUser) {
        await seedDatabase(adminUser);
      }
      
      return NextResponse.json({ success: true, message: 'Database switched successfully' });
    }
    
    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
