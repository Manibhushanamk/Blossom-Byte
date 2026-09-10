import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  priceAtTime: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  gst: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  shippingDetails: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pin: String
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
