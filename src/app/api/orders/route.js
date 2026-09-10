import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    
    const formatted = orders.map(o => ({
      id: o.orderId,
      _id: o._id.toString(),
      userDetails: o.user ? { name: o.user.name, email: o.user.email } : null,
      items: o.items ? o.items.length : 0, 
      cartDetails: o.items, 
      total: o.total,
      status: o.status,
      date: o.createdAt
    }));

    return NextResponse.json({ success: true, orders: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    let user = null;
    if (data.userDetails?.email) {
      user = await User.findOne({ email: data.userDetails.email });
    }

    if (!user) {
      // Find master admin to fall back or just error
      user = await User.findOne({ isAdmin: true });
    }

    const newOrder = await Order.create({
      orderId: data.id,
      user: user._id,
      items: data.cartDetails.map(i => ({ product: null, quantity: i.quantity, priceAtTime: i.product.price })), 
      total: data.total,
      gst: data.gst || 0,
      deliveryFee: data.deliveryFee || 0,
      status: 'Processing'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { orderId, status } = await req.json();
    await Order.findOneAndUpdate({ orderId }, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
