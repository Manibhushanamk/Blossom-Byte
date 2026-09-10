import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'blossom_secret_key_123';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, phone } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone
    });

    const token = jwt.sign({ userId: newUser._id, isAdmin: newUser.isAdmin }, JWT_SECRET, { expiresIn: '7d' });

    const userData = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      isAdmin: newUser.isAdmin,
      tier: newUser.tier,
      addresses: newUser.addresses
    };

    return NextResponse.json({ success: true, token, user: userData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
