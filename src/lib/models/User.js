import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  type: { type: String, default: 'Home' },
  address: String,
  city: String,
  state: String,
  pin: String,
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
  tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], default: 'Silver' },
  addresses: [addressSchema]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
