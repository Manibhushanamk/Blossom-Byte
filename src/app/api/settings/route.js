import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Setting from '@/lib/models/Setting';

export async function GET() {
  try {
    await connectDB();
    const settings = await Setting.find({});
    const map = {};
    settings.forEach(s => {
      map[s.key] = s.value;
    });
    return NextResponse.json({ success: true, settings: map });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const updates = await req.json();
    
    // Upsert each key with $set to prevent E11000 concurrent insert errors
    for (const key of Object.keys(updates)) {
      try {
        await Setting.updateOne(
          { key },
          { $set: { value: updates[key] } },
          { upsert: true }
        );
      } catch (err) {
        if (err.code === 11000) {
          // If a concurrent request inserted it first, just update it normally
          await Setting.updateOne({ key }, { $set: { value: updates[key] } });
        } else {
          throw err;
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
