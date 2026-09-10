import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { email, address } = data;
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, error: 'User not found' });
    
    user.addresses.push({ _id: new mongoose.Types.ObjectId(), ...address });
    await user.save();
    
    // Convert Mongoose doc to lean object for the frontend context
    const cleanUser = JSON.parse(JSON.stringify(user));
    return NextResponse.json({ success: true, addresses: cleanUser.addresses });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const addressId = searchParams.get('id');
    
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, error: 'User not found' });
    
    user.addresses = user.addresses.filter(a => a._id.toString() !== addressId);
    await user.save();
    
    const cleanUser = JSON.parse(JSON.stringify(user));
    return NextResponse.json({ success: true, addresses: cleanUser.addresses });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
