/**
 * Placeholder Products Generator
 * 
 * This script creates placeholder products in the database for testing
 * 
 * Usage: node scripts/add-placeholder-products.js
 */

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection - try multiple possible URLs
const MONGO_URLS = [
  'mongodb://localhost:27017/perfect_sell',
  'mongodb://127.0.0.1:27017/perfect_sell',
  'mongodb://mongodb:27017/perfect_sell',
  process.env.MONGO_URL
].filter(Boolean);

// Placeholder products
const PLACEHOLDER_PRODUCTS = [
  {
    id: uuidv4(),
    name: 'Perfect Cell Figurine',
    description: 'High-quality Perfect Cell action figure with articulated joints and energy effects. Perfect for collectors!',
    price: 49.99,
    category: 'Figures',
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=500',
    stock: 25,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Cell Saga T-Shirt',
    description: 'Premium cotton t-shirt featuring iconic Perfect Cell artwork. Available in multiple sizes.',
    price: 24.99,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    stock: 50,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Perfect Cell Poster',
    description: 'Large format poster (24x36) featuring Perfect Cell in his ultimate form. Museum quality print.',
    price: 19.99,
    category: 'Posters',
    image: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e6?w=500',
    stock: 100,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Cell Games Championship Belt',
    description: 'Replica championship belt from the legendary Cell Games. Metal plates with adjustable strap.',
    price: 89.99,
    category: 'Collectibles',
    image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=500',
    stock: 10,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Perfect Cell Hoodie',
    description: 'Comfortable pullover hoodie with Perfect Cell design. Premium fleece material.',
    price: 44.99,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    stock: 30,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Cell Saga Manga Set',
    description: 'Complete Cell Saga manga collection. Perfect condition collector\'s edition with box.',
    price: 79.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    stock: 15,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Perfect Cell Coffee Mug',
    description: 'Ceramic coffee mug with heat-reactive design. Shows Perfect Cell transformation when hot.',
    price: 14.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    stock: 75,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Cell Phone Case',
    description: 'Durable phone case with Perfect Cell artwork. Available for iPhone and Samsung models.',
    price: 19.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    stock: 60,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Perfect Cell Gaming Mouse Pad',
    description: 'XL gaming mouse pad with Perfect Cell design. Non-slip rubber base, smooth surface.',
    price: 24.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    stock: 40,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Cell Saga DVD Box Set',
    description: 'Complete Cell Saga on DVD. Includes all episodes plus bonus features and interviews.',
    price: 59.99,
    category: 'Media',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500',
    stock: 20,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Perfect Cell Wall Clock',
    description: 'Unique wall clock featuring Perfect Cell. Silent quartz movement, 12-inch diameter.',
    price: 34.99,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500',
    stock: 35,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Cell Saga Backpack',
    description: 'Spacious backpack with Perfect Cell embroidered patch. Multiple compartments, padded straps.',
    price: 54.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    stock: 25,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

async function addPlaceholderProducts() {
  let client = null;
  
  console.log('🔄 Starting placeholder products creation...\n');
  
  // Try connecting to MongoDB
  for (const url of MONGO_URLS) {
    try {
      console.log(`Trying to connect to: ${url.replace(/\/\/.*@/, '//**:**@')}`);
      client = await MongoClient.connect(url, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      });
      console.log('✅ Connected to MongoDB\n');
      break;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      continue;
    }
  }
  
  if (!client) {
    throw new Error('Could not connect to MongoDB with any URL');
  }
  
  try {
    const db = client.db('perfect_sell');
    
    // Check existing products
    const existingCount = await db.collection('products').countDocuments();
    console.log(`📦 Found ${existingCount} existing products in database`);
    
    if (existingCount > 0) {
      console.log('\n⚠️  Products already exist. Options:');
      console.log('1. Keep existing products and add new ones');
      console.log('2. Replace all products with placeholders');
      console.log('\nProceeding with option 1 (adding to existing)...\n');
    }
    
    // Insert placeholder products
    console.log(`📝 Inserting ${PLACEHOLDER_PRODUCTS.length} placeholder products...\n`);
    
    const result = await db.collection('products').insertMany(PLACEHOLDER_PRODUCTS);
    
    console.log(`✅ Successfully inserted ${result.insertedCount} products!\n`);
    
    // Display summary
    console.log('═══════════════════════════════════════');
    console.log('  PLACEHOLDER PRODUCTS CREATED');
    console.log('═══════════════════════════════════════\n');
    
    PLACEHOLDER_PRODUCTS.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Featured: ${product.featured ? 'Yes' : 'No'}`);
      console.log();
    });
    
    // Create indexes
    console.log('🔧 Creating indexes...');
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ featured: 1 });
    console.log('✅ Indexes created\n');
    
    // Final count
    const finalCount = await db.collection('products').countDocuments();
    console.log(`📊 Total products in database: ${finalCount}\n`);
    
    console.log('═══════════════════════════════════════');
    console.log('  SUCCESS!');
    console.log('═══════════════════════════════════════');
    console.log('\nYou can now:');
    console.log('- Browse products at: http://localhost:3000');
    console.log('- View admin dashboard at: http://localhost:3000/admin');
    console.log('- Test cart and checkout functionality');
    console.log();
    
  } finally {
    await client.close();
    console.log('🔌 Database connection closed\n');
  }
}

// Run the script
addPlaceholderProducts()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  });
