/**
 * Update product categories to match collections
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/perfect_sell';

// Map old categories to new collection names
const CATEGORY_MAPPING = {
  'Figures': 'Figures & Collectibles',
  'Collectibles': 'Figures & Collectibles',
  'Apparel': 'Apparel',
  'Accessories': 'Accessories',
  'Books': 'Media & Books',
  'Media': 'Media & Books',
  'Posters': 'Home Decor',
  'Home Decor': 'Home Decor'
};

async function syncCategories() {
  let client = null;
  
  console.log('🔄 Syncing product categories with collections...\n');
  
  try {
    client = await MongoClient.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db();
    const productsCollection = db.collection('products');
    
    // Get all products
    const products = await productsCollection.find({}).toArray();
    console.log(`📦 Found ${products.length} products\n`);
    
    let updated = 0;
    
    for (const product of products) {
      const newCategory = CATEGORY_MAPPING[product.category] || 'Accessories';
      
      if (product.category !== newCategory) {
        await productsCollection.updateOne(
          { id: product.id },
          { $set: { category: newCategory } }
        );
        console.log(`✅ Updated: ${product.name}`);
        console.log(`   Old: "${product.category}" → New: "${newCategory}"`);
        updated++;
      } else {
        console.log(`⏭️  Skipped: ${product.name} (already "${product.category}")`);
      }
    }
    
    console.log(`\n✅ Updated ${updated} products\n`);
    
    // Show category distribution
    const categories = await productsCollection.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    console.log('═══════════════════════════════════════');
    console.log('  CATEGORY DISTRIBUTION');
    console.log('═══════════════════════════════════════\n');
    
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} products`);
    });
    console.log();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed\n');
    }
  }
}

// Run the script
syncCategories()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  });
