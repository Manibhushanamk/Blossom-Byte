import { NextResponse } from 'next/server';
import { clearConfig } from '@/lib/config';

export async function POST() {
  const success = clearConfig();
  if (success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: 'Failed to delete configuration' }, { status: 500 });
  }
}
