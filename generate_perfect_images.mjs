import fs from 'fs';
import path from 'path';

// Read data.js as text and parse out the product ids and names
const dataPath = path.join(process.cwd(), 'src', 'lib', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf-8');

const productRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
const products = [];
let match;
while ((match = productRegex.exec(dataContent)) !== null) {
  products.push({ id: match[1], name: match[2] });
}

const categoryRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)'(?:,\s*slug:\s*'[^']+')?,\s*image:\s*'\/assets\/products\/[^']+\.jpg'/g;
const categories = [];
let catMatch;
while ((catMatch = categoryRegex.exec(dataContent)) !== null) {
  categories.push({ id: catMatch[1], name: catMatch[2] });
}

console.log(`Found ${products.length} products and ${categories.length} categories.`);

const outputDir = path.join(process.cwd(), 'public', 'assets', 'products');

// Helper to hash string to a number for loremflickr lock
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

async function downloadImage(url, dest) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buffer));
    return true;
  } catch (e) {
    console.error(`Error downloading ${url}: ${e.message}`);
    return false;
  }
}

async function processAll() {
  const items = [...categories, ...products];
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(items.length/BATCH_SIZE)}...`);
    
    await Promise.all(batch.map(async (item) => {
      const fileName = `${item.id}.jpg`;
      const destPath = path.join(outputDir, fileName);
      
      // Extract main keywords from product name. Ex: "Crimson Rose" -> "crimson,rose"
      // Remove stop words and keep it simple.
      let cleanName = item.name.toLowerCase().replace(/collection|bouquet|plant|flower|seeds|premium|luxury/g, '').trim();
      if (!cleanName) cleanName = item.name.toLowerCase();
      
      let keywords = cleanName.split(/\s+/).filter(k => k.length > 2).join(',');
      if (!keywords) keywords = "flower";
      
      // Add context based on category
      if (item.id.includes('plants')) keywords += ",plant";
      else if (item.id.includes('decor')) keywords += ",decoration";
      else if (item.id.includes('bouquets')) keywords += ",bouquet";
      else if (item.id.includes('gift')) keywords += ",gift";
      else if (item.id.includes('fresh')) keywords += ",flower";
      
      const lockId = hashString(item.id);
      const url = `https://loremflickr.com/600/800/${keywords}?lock=${lockId}`;
      
      console.log(`  Downloading ${fileName} with keywords: [${keywords}]`);
      await downloadImage(url, destPath);
    }));
  }
  
  console.log("All done generating precise images via LoremFlickr!");
}

processAll();
