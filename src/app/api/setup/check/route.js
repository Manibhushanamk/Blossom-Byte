import { NextResponse } from 'next/server';
import { isConfigured } from '@/lib/config';

export async function GET() {
  const configured = isConfigured();
  return NextResponse.json({ isConfigured: configured });
}
