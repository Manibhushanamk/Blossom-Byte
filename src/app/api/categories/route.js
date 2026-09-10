import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Category from '@/lib/models/Category';
import { CATEGORIES } from '@/lib/data';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ success: true, isOffline: true, categories: CATEGORIES.map(c => ({ _id: c.id, ...c })), error: error.message });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const category = await Category.create(data);
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ success: true, isOffline: true, error: error.message });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { _id, ...updates } = data;
    if (updates.name && !updates.slug) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const category = await Category.findByIdAndUpdate(_id, updates, { new: true });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ success: true, isOffline: true, error: error.message });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true, isOffline: true, error: error.message });
  }
}
