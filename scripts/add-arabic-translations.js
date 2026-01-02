/**
 * Add Arabic translations to existing products
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/perfectcell';

// Arabic translations for products
const ARABIC_TRANSLATIONS = {
  'Perfect Cell Figurine': {
    nameAr: 'تمثال سيل المثالي',
    descriptionAr: 'تمثال عالي الجودة لسيل المثالي مع مفاصل متحركة وتأثيرات طاقة. مثالي للمقتنيات!'
  },
  'Cell Saga T-Shirt': {
    nameAr: 'تي شيرت ملحمة سيل',
    descriptionAr: 'تي شيرت قطني فاخر يحمل رسوم سيل المثالي الأيقونية. متوفر بعدة مقاسات.'
  },
  'Perfect Cell Poster': {
    nameAr: 'ملصق سيل المثالي',
    descriptionAr: 'ملصق كبير الحجم (24×36) يعرض سيل المثالي في شكله النهائي. طباعة بجودة المتاحف.'
  },
  'Cell Games Championship Belt': {
    nameAr: 'حزام بطولة ألعاب سيل',
    descriptionAr: 'نسخة طبق الأصل من حزام البطولة الأسطوري لألعاب سيل. ألواح معدنية مع حزام قابل للتعديل.'
  },
  'Perfect Cell Hoodie': {
    nameAr: 'هودي سيل المثالي',
    descriptionAr: 'هودي مريح بتصميم سيل المثالي. مادة صوف فاخرة.'
  },
  'Cell Saga Manga Set': {
    nameAr: 'مجموعة مانجا ملحمة سيل',
    descriptionAr: 'مجموعة مانجا ملحمة سيل الكاملة. نسخة المقتنيات بحالة ممتازة مع صندوق.'
  },
  'Perfect Cell Coffee Mug': {
    nameAr: 'كوب قهوة سيل المثالي',
    descriptionAr: 'كوب قهوة سيراميك مع تصميم يتفاعل مع الحرارة. يظهر تحول سيل المثالي عند السخونة.'
  },
  'Cell Phone Case': {
    nameAr: 'حافظة هاتف سيل',
    descriptionAr: 'حافظة هاتف متينة برسوم سيل المثالي. متوفرة لأجهزة آيفون وسامسونج.'
  },
  'Perfect Cell Gaming Mouse Pad': {
    nameAr: 'حصيرة ماوس ألعاب سيل المثالي',
    descriptionAr: 'حصيرة ماوس ألعاب XL بتصميم سيل المثالي. قاعدة مطاطية غير قابلة للانزلاق وسطح ناعم.'
  },
  'Cell Saga DVD Box Set': {
    nameAr: 'مجموعة أقراص DVD لملحمة سيل',
    descriptionAr: 'ملحمة سيل الكاملة على DVD. تشمل جميع الحلقات بالإضافة إلى ميزات إضافية ومقابلات.'
  },
  'Perfect Cell Wall Clock': {
    nameAr: 'ساعة حائط سيل المثالي',
    descriptionAr: 'ساعة حائط فريدة تعرض سيل المثالي. حركة كوارتز صامتة، قطر 12 بوصة.'
  },
  'Cell Saga Backpack': {
    nameAr: 'حقيبة ظهر ملحمة سيل',
    descriptionAr: 'حقيبة ظهر واسعة مع رقعة سيل المثالي المطرزة. عدة أقسام، أحزمة مبطنة.'
  }
};

async function addArabicTranslations() {
  let client = null;
  
  console.log('🔄 Adding Arabic translations to products...\n');
  
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
      const translation = ARABIC_TRANSLATIONS[product.name];
      if (translation) {
        await productsCollection.updateOne(
          { id: product.id },
          { 
            $set: { 
              nameAr: translation.nameAr,
              descriptionAr: translation.descriptionAr
            }
          }
        );
        console.log(`✅ Updated: ${product.name}`);
        updated++;
      } else {
        console.log(`⚠️  No translation for: ${product.name}`);
      }
    }
    
    console.log(`\n✅ Updated ${updated} products with Arabic translations\n`);
    
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
addArabicTranslations()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  });
