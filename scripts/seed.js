const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'perfect_cell_store';

async function seed() {
  console.log('🌱 Starting database seed...');
  
  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('products').deleteMany({});
    await db.collection('collections').deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Create Collections
    console.log('📦 Creating collections...');
    const collections = [
      {
        id: uuidv4(),
        name: 'Rare Collectibles',
        nameAr: 'المقتنيات النادرة',
        description: 'Exclusive and rare items for true collectors',
        descriptionAr: 'عناصر حصرية ونادرة لهواة الجمع الحقيقيين',
        image: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=800',
        icon: '💎',
        showOnHome: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Action Figures',
        nameAr: 'التماثيل والمجسمات',
        description: 'Premium action figures and statues',
        descriptionAr: 'تماثيل ومجسمات متميزة',
        image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800',
        icon: '🦸',
        showOnHome: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Cosplay Gear',
        nameAr: 'معدات الكوسبلاي',
        description: 'Professional cosplay costumes and accessories',
        descriptionAr: 'أزياء وإكسسوارات كوسبلاي احترافية',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        icon: '🎭',
        showOnHome: true,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Weapon Replicas',
        nameAr: 'نسخ الأسلحة',
        description: 'High-quality weapon replicas from your favorite series',
        descriptionAr: 'نسخ عالية الجودة من الأسلحة من مسلسلاتك المفضلة',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
        icon: '⚔️',
        showOnHome: true,
        createdAt: new Date().toISOString()
      }
    ];
    
    await db.collection('collections').insertMany(collections);
    console.log(`✅ Created ${collections.length} collections`);
    
    // Create Products
    console.log('🛍️  Creating products...');
    const products = [
      {
        id: uuidv4(),
        name: 'Super Saiyan Goku Figure',
        nameAr: 'تمثال جوكو السوبر سايان',
        description: 'Premium 12-inch Super Saiyan Goku action figure with LED effects and multiple accessories. Limited edition collectible.',
        descriptionAr: 'تمثال جوكو السوبر سايان المتميز بحجم 12 بوصة مع تأثيرات LED وملحقات متعددة. نسخة محدودة للتحصيل.',
        price: 149.99,
        originalPrice: 199.99,
        category: 'Action Figures',
        image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800',
        stock: 25,
        onSale: true,
        discountPercentage: 25,
        dealLabel: 'Limited Time',
        featured: true,
        tags: 'dragon ball, goku, super saiyan, anime, collectible',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Perfect Cell Helmet',
        nameAr: 'خوذة بيرفكت سيل',
        description: 'Authentic Perfect Cell cosplay helmet with bio-organic design. Made from high-quality resin with hand-painted details.',
        descriptionAr: 'خوذة كوسبلاي أصلية لبيرفكت سيل بتصميم عضوي حيوي. مصنوعة من راتنج عالي الجودة مع تفاصيل مرسومة باليد.',
        price: 299.99,
        originalPrice: 399.99,
        category: 'Cosplay Gear',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        stock: 15,
        onSale: true,
        discountPercentage: 25,
        dealLabel: 'Hot Deal',
        featured: true,
        tags: 'dragon ball, perfect cell, cosplay, helmet, replica',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Excalibur Sword Replica',
        nameAr: 'نسخة سيف إكسكاليبور',
        description: 'Full-size Excalibur sword replica with stainless steel blade and detailed grip. Display stand included.',
        descriptionAr: 'نسخة طبق الأصل بالحجم الكامل من سيف إكسكاليبور مع نصل من الفولاذ المقاوم للصدأ ومقبض مفصل. حامل العرض مرفق.',
        price: 399.99,
        originalPrice: null,
        category: 'Weapon Replicas',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
        stock: 10,
        onSale: false,
        discountPercentage: 0,
        dealLabel: '',
        featured: true,
        tags: 'excalibur, sword, replica, medieval, weapon',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Naruto Headband Set',
        nameAr: 'مجموعة عصابة رأس ناروتو',
        description: 'Complete set of village headbands from Naruto series. Includes Konoha, Sand, Mist, Cloud, and Stone village symbols.',
        descriptionAr: 'مجموعة كاملة من عصابات رأس القرى من سلسلة ناروتو. تشمل رموز قرية كونوها والرمل والضباب والسحاب والحجر.',
        price: 79.99,
        originalPrice: 99.99,
        category: 'Cosplay Gear',
        image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800',
        stock: 50,
        onSale: true,
        discountPercentage: 20,
        dealLabel: 'Popular',
        featured: false,
        tags: 'naruto, headband, cosplay, anime, ninja',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Vegeta Elite Armor',
        nameAr: 'درع فيجيتا النخبة',
        description: 'Professional-grade Saiyan Elite armor cosplay set. Includes chest piece, shoulder guards, and gloves. One size fits most.',
        descriptionAr: 'مجموعة درع نخبة سايان بجودة احترافية للكوسبلاي. يشمل قطعة الصدر وواقيات الكتف والقفازات. مقاس واحد يناسب معظم الأحجام.',
        price: 249.99,
        originalPrice: 349.99,
        category: 'Cosplay Gear',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        stock: 20,
        onSale: true,
        discountPercentage: 29,
        dealLabel: 'Flash Sale',
        featured: true,
        tags: 'dragon ball, vegeta, armor, cosplay, saiyan',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'One Piece Straw Hat',
        nameAr: 'قبعة القش من ون بيس',
        description: 'Authentic replica of Luffy\'s iconic straw hat. Made from natural straw with adjustable inner band.',
        descriptionAr: 'نسخة طبق الأصل من قبعة القش الشهيرة للوفي. مصنوعة من القش الطبيعي مع شريط داخلي قابل للتعديل.',
        price: 49.99,
        originalPrice: null,
        category: 'Cosplay Gear',
        image: 'https://images.unsplash.com/photo-1529720317453-c8da503f2051?w=800',
        stock: 100,
        onSale: false,
        discountPercentage: 0,
        dealLabel: '',
        featured: false,
        tags: 'one piece, luffy, straw hat, anime, cosplay',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Master Sword (Legend of Zelda)',
        nameAr: 'السيف الرئيسي (أسطورة زيلدا)',
        description: 'Full-scale Master Sword replica with blue grip and Triforce details. Comes with leather-wrapped scabbard.',
        descriptionAr: 'نسخة طبق الأصل بالحجم الكامل من السيف الرئيسي مع مقبض أزرق وتفاصيل ترايفورس. يأتي مع غمد ملفوف بالجلد.',
        price: 349.99,
        originalPrice: 449.99,
        category: 'Weapon Replicas',
        image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
        stock: 12,
        onSale: true,
        discountPercentage: 22,
        dealLabel: 'Legendary',
        featured: true,
        tags: 'zelda, master sword, replica, gaming, weapon',
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Rare Manga Collection Box Set',
        nameAr: 'مجموعة صندوق مانجا نادرة',
        description: 'Complete Dragon Ball Z manga box set with all 42 volumes. First edition prints in mint condition.',
        descriptionAr: 'مجموعة صندوق مانجا دراغون بول زد الكاملة مع جميع المجلدات الـ 42. طبعات أولى في حالة ممتازة.',
        price: 599.99,
        originalPrice: null,
        category: 'Rare Collectibles',
        image: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800',
        stock: 5,
        onSale: false,
        discountPercentage: 0,
        dealLabel: '',
        featured: false,
        tags: 'dragon ball, manga, rare, collectible, books',
        createdAt: new Date().toISOString()
      }
    ];
    
    await db.collection('products').insertMany(products);
    console.log(`✅ Created ${products.length} products`);
    
    // Verify admin user exists
    const adminEmail = 'perfectcellstore@gmail.com';
    const adminEmailLower = adminEmail.toLowerCase();
    const existingAdmin = await db.collection('users').findOne({ emailLower: adminEmailLower });
    
    if (!existingAdmin) {
      console.log('👤 Creating admin user...');
      const hashedPassword = await bcrypt.hash('DragonBall123!', 10);
      await db.collection('users').insertOne({
        id: uuidv4(),
        email: adminEmail,
        emailLower: adminEmailLower,
        password: hashedPassword,
        name: 'Perfect Cell Admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    console.log('\n✨ Database seeding complete!');
    console.log(`📦 Collections: ${collections.length}`);
    console.log(`🛍️  Products: ${products.length}`);
    console.log('\n🔐 Admin Login:');
    console.log('   Email: perfectcellstore@gmail.com');
    console.log('   Password: DragonBall123!');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Database connection closed');
  }
}

seed();
