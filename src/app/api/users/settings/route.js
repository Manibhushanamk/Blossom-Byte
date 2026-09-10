import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { email, name, phone, password, newPassword } = data;
    
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, error: 'User not found' });
    
    if (newPassword) {
       // Allow matching plaintext (from seed) or bcrypt hash
       const isMatch = (user.password === password) || (await bcrypt.compare(password, user.password));
       if (!isMatch) return NextResponse.json({ success: false, error: 'Incorrect current password' });
       user.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    
    const cleanUser = JSON.parse(JSON.stringify(user));
    return NextResponse.json({ success: true, user: cleanUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
