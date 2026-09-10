import { connectDB } from './db';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import Setting from './models/Setting';

export async function seedDatabase(adminData) {
  await connectDB();

  console.log('Seeding database...');

  // 1. Seed Categories (Matching Storefront Navbar)
  await Category.deleteMany({});
  await Product.deleteMany({});

  const categories = await Category.insertMany([
    { name: 'Fresh Flowers', slug: 'fresh-flowers', description: 'Premium fresh flowers.', image: 'https://image.pollinations.ai/prompt/luxury%20fresh%20flowers%20floral%20design?width=800&height=1000&nologo=true' },
    { name: 'Flower Bouquets', slug: 'bouquets', description: 'Beautiful handcrafted bouquets.', image: 'https://image.pollinations.ai/prompt/luxury%20flower%20bouquet?width=800&height=1000&nologo=true' },
    { name: 'Flower Plants', slug: 'plants', description: 'Lush indoor and outdoor plants.', image: 'https://image.pollinations.ai/prompt/luxury%20indoor%20flower%20plant?width=800&height=1000&nologo=true' },
    { name: 'Flower Seeds', slug: 'seeds', description: 'Premium flower seeds.', image: 'https://image.pollinations.ai/prompt/premium%20flower%20seeds%20packet?width=800&height=1000&nologo=true' },
    { name: 'Decoration Flowers', slug: 'decor', description: 'Elegant decorative flowers.', image: 'https://image.pollinations.ai/prompt/luxury%20flower%20decoration%20event?width=800&height=1000&nologo=true' },
    { name: 'Gift Combos', slug: 'gift-combos', description: 'Perfect floral gift combinations.', image: 'https://image.pollinations.ai/prompt/luxury%20flower%20gift%20combo%20box?width=800&height=1000&nologo=true' }
  ]);

  // 2. Seed 70+ Products
  const products = [];
  const adjectives = ['Velvet', 'Midnight', 'Crimson', 'Azure', 'Golden', 'Ivory', 'Radiant', 'Opulent', 'Ethereal', 'Royal'];
  const types = ['Rose', 'Orchid', 'Lily', 'Tulip', 'Peony', 'Hydrangea', 'Lotus', 'Iris', 'Dahlia', 'Jasmine'];
  
  for (let i = 1; i <= 75; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Ensure every single product gets a visually unique image
    const imageUrl = `https://image.pollinations.ai/prompt/luxury%20${encodeURIComponent(adj.toLowerCase())}%20${encodeURIComponent(type.toLowerCase())}%20flower%20bloom%20minimalist%20background%20${i}?width=600&height=800&nologo=true`;
    
    products.push({
      name: `${adj} ${type} Collection ${i}`,
      description: `A stunning premium arrangement of ${adj.toLowerCase()} ${type.toLowerCase()}s, perfect for any luxury setting. Hand-picked and assembled by master florists.`,
      price: Math.floor(Math.random() * 8000) + 1500, // INR 1500 to 9500
      discount: Math.random() > 0.8 ? Math.floor(Math.random() * 20) + 5 : 0,
      category: category._id,
      stock: Math.floor(Math.random() * 30) + 5,
      image: imageUrl,
      features: ['Hand-picked', 'Same day delivery', 'Premium Vase Included'],
      isFeatured: i <= 8, // Make the first 8 featured
      sku: `BLS-${String(i).padStart(4, '0')}`
    });
  }

  await Product.insertMany(products);

  // 3. Seed Settings
  await Setting.insertMany([
    { key: 'websiteName', value: 'Blossom Byte' },
    { key: 'currency', value: 'INR' },
    { key: 'deliveryFee', value: 150 },
    { key: 'freeDeliveryThreshold', value: 1500 },
    { key: 'gstRate', value: 0.18 },
    { key: 'contactEmail', value: 'hello@blossombyte.com' },
    { key: 'contactPhone', value: '+91 99999 00000' }
  ]);

  // 4. Seed Admin User
  if (adminData) {
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (!existingAdmin) {
      await User.create({
        name: adminData.name,
        email: adminData.email,
        password: adminData.password, // In a real app, hash this with bcrypt!
        phone: adminData.phone,
        isAdmin: true,
        tier: 'Platinum'
      });
    }
  }

  console.log('Seeding complete! 75 unique products generated.');
  return true;
}
