import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, required: true, default: 10 },
  image: { type: String, required: true }, // The main URL for the unique image
  features: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  sku: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
