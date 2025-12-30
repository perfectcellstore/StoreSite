const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'perfect_sell';

async function seedDatabase() {
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  console.log('🌱 Seeding database...');

  // Create admin user
  const adminExists = await db.collection('users').findOne({ email: 'perfectcellstore@gmail.com' });
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    const admin = {
      id: uuidv4(),
      email: 'perfectcellstore@gmail.com',
      password: hashedPassword,
      name: 'Perfect Cell Admin',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    await db.collection('users').insertOne(admin);
    console.log('✅ Admin user created (email: perfectcellstore@gmail.com, password: admin123456)');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create sample products
  const productsCount = await db.collection('products').countDocuments();
  
  if (productsCount === 0) {
    const sampleProducts = [
      {
        id: uuidv4(),
        name: 'Premium Collectible Figure',
        nameAr: 'تمثال مقتنيات ممتاز',
        description: 'Limited edition premium collectible figure with intricate details and premium finish',
        descriptionAr: 'تمثال مقتنيات محدود الإصدار بتفاصيل معقدة وتشطيب ممتاز',
        price: 99.99,
        category: 'collectibles',
        image: 'https://images.pexels.com/photos/1812237/pexels-photo-1812237.jpeg',
        images: [
          'https://images.pexels.com/photos/1812237/pexels-photo-1812237.jpeg',
          'https://images.pexels.com/photos/4119179/pexels-photo-4119179.jpeg'
        ],
        stock: 15,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Legendary Weapon Replica',
        nameAr: 'نسخة سلاح أسطوري',
        description: 'High-quality weapon replica with authentic details and premium materials',
        descriptionAr: 'نسخة سلاح عالية الجودة بتفاصيل أصلية ومواد ممتازة',
        price: 149.99,
        category: 'weapons',
        image: 'https://images.pexels.com/photos/6091649/pexels-photo-6091649.jpeg',
        images: [
          'https://images.pexels.com/photos/6091649/pexels-photo-6091649.jpeg',
          'https://images.pexels.com/photos/4119179/pexels-photo-4119179.jpeg'
        ],
        stock: 8,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Elite Statue Collection',
        nameAr: 'مجموعة تماثيل النخبة',
        description: 'Exclusive statue with hand-painted details and certificate of authenticity',
        descriptionAr: 'تمثال حصري بتفاصيل مرسومة يدوياً وشهادة أصالة',
        price: 199.99,
        category: 'figures',
        image: 'https://images.pexels.com/photos/1812237/pexels-photo-1812237.jpeg',
        images: [
          'https://images.pexels.com/photos/1812237/pexels-photo-1812237.jpeg'
        ],
        stock: 5,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Premium Mask Replica',
        nameAr: 'نسخة قناع ممتاز',
        description: 'Detailed mask replica with premium finish and display stand',
        descriptionAr: 'نسخة قناع مفصلة بتشطيب ممتاز وحامل عرض',
        price: 79.99,
        category: 'masks',
        image: 'https://images.pexels.com/photos/4119179/pexels-photo-4119179.jpeg',
        images: [
          'https://images.pexels.com/photos/4119179/pexels-photo-4119179.jpeg'
        ],
        stock: 12,
        featured: false,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Rare Historical Artifact',
        nameAr: 'قطعة تاريخية نادرة',
        description: 'Museum-quality historical artifact replica with documentation',
        descriptionAr: 'نسخة أثرية تاريخية بجودة المتحف مع الوثائق',
        price: 299.99,
        category: 'historical',
        image: 'https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg',
        images: [
          'https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg'
        ],
        stock: 3,
        featured: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Professional Cosplay Armor',
        nameAr: 'درع تنكري احترافي',
        description: 'High-grade cosplay armor set with adjustable fittings',
        descriptionAr: 'مجموعة درع تنكرية عالية الجودة مع تركيبات قابلة للتعديل',
        price: 249.99,
        category: 'cosplay',
        image: 'https://images.pexels.com/photos/1480690/pexels-photo-1480690.jpeg',
        images: [
          'https://images.pexels.com/photos/1480690/pexels-photo-1480690.jpeg'
        ],
        stock: 6,
        featured: false,
        createdAt: new Date().toISOString()
      }
    ];

    await db.collection('products').insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} sample products created`);
  } else {
    console.log(`ℹ️  ${productsCount} products already exist in database`);
  }

  await client.close();
  console.log('🎉 Database seeding completed!');
}

seedDatabase().catch(console.error);
