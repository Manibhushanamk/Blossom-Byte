import { NextResponse } from 'next/server';
import { saveConfig } from '@/lib/config';
import { seedDatabase } from '@/lib/seed';

export async function POST(req) {
  try {
    const { adminUser, dbConfig } = await req.json();
    
    // Save the configuration
    const success = saveConfig({
      dbUri: dbConfig.uri,
      dbName: dbConfig.dbName,
      isSetupComplete: true,
      setupDate: new Date().toISOString()
    });

    if (!success) {
      return NextResponse.json({ success: false, error: 'Failed to save configuration locally' }, { status: 500 });
    }

    // Initialize the database and seed it!
    await seedDatabase(adminUser);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
