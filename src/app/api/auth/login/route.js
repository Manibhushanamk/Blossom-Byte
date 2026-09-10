import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'blossom_secret_key_123';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    try {
      await connectDB();
    } catch (e) {
      if (e.message.includes('Database is not configured')) {
        if (email === 'admin@gmail.com' && password === 'admin@123') {
           const token = jwt.sign({ userId: 'offline-admin', isAdmin: true }, JWT_SECRET, { expiresIn: '7d' });
           const userData = { id: 'offline-admin', name: 'Offline Admin', email: 'admin@gmail.com', isAdmin: true, tier: 'Platinum' };
           return NextResponse.json({ success: true, token, user: userData });
        }
        return NextResponse.json({ success: false, error: 'Database offline. Use admin@gmail.com / admin@123' }, { status: 401 });
      }
      throw e;
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    let isMatch = false;
    if (user.password === password) {
      isMatch = true; // For the seeded admin account (plaintext)
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      tier: user.tier,
      addresses: user.addresses
    };

    return NextResponse.json({ success: true, token, user: userData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
