/**
 * Migration Script: Move Placeholder Categories to Collections
 * 
 * This script migrates all hardcoded categories to the collections database
 * so they can be managed through the admin dashboard.
 * 
 * Usage: node scripts/migrate-collections.js
 */

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection URLs
const MONGO_URLS = [
  'mongodb://localhost:27017/perfect_sell',
  'mongodb://127.0.0.1:27017/perfect_sell',
  'mongodb://mongodb:27017/perfect_sell',
  process.env.MONGO_URL
].filter(Boolean);

// Placeholder collections with proper data
const COLLECTIONS = [
  {
    id: uuidv4(),
    name: 'Collectibles',
    nameAr: 'المقتنيات',
    description: 'Rare and unique collectible items for enthusiasts',
    descriptionAr: 'قطع نادرة وفريدة للهواة والمقتنين',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200',
    icon: '📦',
    showOnHome: true,
    category: 'collectibles',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Historical Items',
    nameAr: 'القطع التاريخية',
    description: 'Authentic replicas and historical artifacts',
    descriptionAr: 'نسخ أصلية وقطع تاريخية',
    image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=1200',
    icon: '🏺',
    showOnHome: true,
    category: 'historical',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Cosplay & Gear',
    nameAr: 'الأزياء والمعدات',
    description: 'Professional cosplay costumes and accessories',
    descriptionAr: 'أزياء كوسبلاي احترافية واكسسوارات',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200',
    icon: '🎭',
    showOnHome: true,
    category: 'cosplay',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Weapon Replicas',
    nameAr: 'نسخ الأسلحة',
    description: 'High-quality weapon replicas from movies and games',
    descriptionAr: 'نسخ عالية الجودة من الأسلحة في الأفلام والألعاب',
    image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=1200',
    icon: '⚔️',
    showOnHome: true,
    category: 'weapons',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Figures & Statues',
    nameAr: 'التماثيل والمجسمات',
    description: 'Detailed action figures and collector statues',
    descriptionAr: 'مجسمات أكشن مفصلة وتماثيل للمقتنين',
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=1200',
    icon: '🗿',
    showOnHome: true,
    category: 'figures',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Masks',
    nameAr: 'الأقنعة',
    description: 'Character masks and face coverings',
    descriptionAr: 'أقنعة الشخصيات وأغطية الوجه',
    image: 'https://images.unsplash.com/photo-1578664182210-3e4b0b7ec3a9?w=1200',
    icon: '🎭',
    showOnHome: false,
    category: 'masks',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Toys',
    nameAr: 'الألعاب',
    description: 'Collectible toys and playsets',
    descriptionAr: 'ألعاب قابلة للتحصيل ومجموعات اللعب',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200',
    icon: '🎮',
    showOnHome: false,
    category: 'toys',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Rare Items',
    nameAr: 'القطع النادرة',
    description: 'Extremely rare and limited edition collectibles',
    descriptionAr: 'مقتنيات نادرة للغاية وإصدارات محدودة',
    image: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e6?w=1200',
    icon: '💎',
    showOnHome: true,
    category: 'rare',
    createdAt: new Date().toISOString()
  }
];

async function migrateCollections() {
  let client = null;
  
  console.log('🔄 Starting collections migration...\n');
  
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
    
    // Check existing collections
    const existingCollections = await db.collection('collections').find({}).toArray();
    console.log(`📦 Found ${existingCollections.length} existing collections in database\n`);
    
    if (existingCollections.length > 0) {
      console.log('⚠️  Collections already exist. Options:');
      console.log('1. Skip migration (keep existing)');
      console.log('2. Add new collections only (avoid duplicates)');
      console.log('3. Replace all collections\n');
      console.log('Proceeding with option 2 (add new only)...\n');
    }
    
    // Check for duplicates by name
    const existingNames = existingCollections.map(c => c.name.toLowerCase());
    const newCollections = COLLECTIONS.filter(c => !existingNames.includes(c.name.toLowerCase()));
    
    if (newCollections.length === 0) {
      console.log('✅ All collections already exist! No migration needed.\n');
      console.log('📋 Existing collections:');
      existingCollections.forEach((col, index) => {
        console.log(`   ${index + 1}. ${col.icon} ${col.name} / ${col.nameAr}`);
      });
    } else {
      // Insert new collections
      console.log(`📝 Inserting ${newCollections.length} new collections...\n`);
      
      const result = await db.collection('collections').insertMany(newCollections);
      
      console.log(`✅ Successfully inserted ${result.insertedCount} collections!\n`);
      
      // Display summary
      console.log('═══════════════════════════════════════');
      console.log('  COLLECTIONS MIGRATED');
      console.log('═══════════════════════════════════════\n');
      
      newCollections.forEach((collection, index) => {
        console.log(`${index + 1}. ${collection.icon} ${collection.name}`);
        console.log(`   Arabic: ${collection.nameAr}`);
        console.log(`   Category: ${collection.category}`);
        console.log(`   Homepage: ${collection.showOnHome ? 'Yes' : 'No'}`);
        console.log();
      });
    }
    
    // Create index
    console.log('🔧 Creating indexes...');
    await db.collection('collections').createIndex({ name: 1 });
    await db.collection('collections').createIndex({ category: 1 });
    console.log('✅ Indexes created\n');
    
    // Final count
    const finalCount = await db.collection('collections').countDocuments();
    console.log(`📊 Total collections in database: ${finalCount}\n`);
    
    console.log('═══════════════════════════════════════');
    console.log('  SUCCESS!');
    console.log('═══════════════════════════════════════');
    console.log('\nYou can now:');
    console.log('- Go to /admin → Collections tab');
    console.log('- Edit collection names, images, descriptions');
    console.log('- Toggle homepage visibility');
    console.log('- Change icons');
    console.log('- Add/remove collections');
    console.log();
    
  } finally {
    await client.close();
    console.log('🔌 Database connection closed\n');
  }
}

// Run the script
migrateCollections()
  .then(() => {
    console.log('✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  });
