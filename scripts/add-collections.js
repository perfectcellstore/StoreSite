/**
 * Add placeholder collections with bilingual support
 */

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/perfect_sell';

// Placeholder collections with Arabic translations
const COLLECTIONS = [
  {
    id: uuidv4(),
    name: 'Figures & Collectibles',
    nameAr: 'التماثيل والمقتنيات',
    description: 'High-quality action figures and collectible items featuring Perfect Cell',
    descriptionAr: 'تماثيل عالية الجودة وقطع مقتنيات تعرض سيل المثالي',
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800',
    icon: '🎭',
    showOnHome: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Apparel',
    nameAr: 'الملابس',
    description: 'Stylish clothing and fashion items with Perfect Cell designs',
    descriptionAr: 'ملابس وأزياء أنيقة بتصاميم سيل المثالي',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    icon: '👕',
    showOnHome: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Accessories',
    nameAr: 'الإكسسوارات',
    description: 'Essential accessories including phone cases, mugs, and more',
    descriptionAr: 'إكسسوارات أساسية تشمل حافظات الهاتف والأكواب والمزيد',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
    icon: '🎒',
    showOnHome: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Media & Books',
    nameAr: 'الوسائط والكتب',
    description: 'Manga sets, DVDs, and reading materials from the Cell Saga',
    descriptionAr: 'مجموعات المانجا وأقراص DVD ومواد القراءة من ملحمة سيل',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
    icon: '📚',
    showOnHome: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Home Decor',
    nameAr: 'ديكور المنزل',
    description: 'Posters, clocks, and decorative items for your space',
    descriptionAr: 'ملصقات وساعات وقطع ديكور لمساحتك',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800',
    icon: '🏠',
    showOnHome: true,
    createdAt: new Date().toISOString()
  }
];

async function addCollections() {
  let client = null;
  
  console.log('🔄 Adding placeholder collections...\n');
  
  try {
    client = await MongoClient.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db();
    const collectionsCol = db.collection('collections');
    
    // Check existing collections
    const existingCount = await collectionsCol.countDocuments();
    console.log(`📦 Found ${existingCount} existing collections\n`);
    
    if (existingCount > 0) {
      console.log('⚠️  Collections already exist. Clearing old collections...\n');
      await collectionsCol.deleteMany({});
    }
    
    // Insert collections
    console.log(`📝 Inserting ${COLLECTIONS.length} collections...\n`);
    
    const result = await collectionsCol.insertMany(COLLECTIONS);
    
    console.log(`✅ Successfully inserted ${result.insertedCount} collections!\n`);
    
    // Display summary
    console.log('═══════════════════════════════════════');
    console.log('  COLLECTIONS CREATED');
    console.log('═══════════════════════════════════════\n');
    
    COLLECTIONS.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name} / ${collection.nameAr}`);
      console.log(`   Icon: ${collection.icon}`);
      console.log(`   Show on Home: ${collection.showOnHome ? 'Yes' : 'No'}`);
      console.log();
    });
    
    console.log('═══════════════════════════════════════');
    console.log('  SUCCESS!');
    console.log('═══════════════════════════════════════\n');
    
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
addCollections()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  });
