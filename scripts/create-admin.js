/**
 * Admin User Creation Script
 * 
 * This script creates or updates the admin user in the database.
 * Run this script whenever admin login fails.
 * 
 * Usage: node scripts/create-admin.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Admin credentials
const ADMIN_EMAIL = 'perfectcellstore@gmail.com';
const ADMIN_PASSWORD = 'admin123456';
const ADMIN_NAME = 'Perfect Cell Admin';

// MongoDB connection - try multiple possible URLs
const MONGO_URLS = [
  'mongodb://localhost:27017/perfect_sell',
  'mongodb://127.0.0.1:27017/perfect_sell',
  'mongodb://mongodb:27017/perfect_sell',
  process.env.MONGO_URL
].filter(Boolean);

async function createAdmin() {
  let client = null;
  
  console.log('🔄 Starting admin user creation/update...\n');
  
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
    const emailLower = ADMIN_EMAIL.toLowerCase().trim();
    
    // Check if admin user already exists
    console.log('🔍 Checking if admin user exists...');
    const existingAdmin = await db.collection('users').findOne({
      $or: [
        { emailLower },
        { email: ADMIN_EMAIL },
        { email: { $regex: `^${ADMIN_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }
      ]
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user found in database\n');
      console.log('📝 Admin user details:');
      console.log('   ID:', existingAdmin.id);
      console.log('   Email:', existingAdmin.email);
      console.log('   Name:', existingAdmin.name);
      console.log('   Role:', existingAdmin.role);
      console.log('   Has emailLower:', !!existingAdmin.emailLower);
      console.log('   Has password:', !!existingAdmin.password);
      console.log();
      
      // Fix any missing fields
      const updates = {};
      let needsUpdate = false;
      
      if (!existingAdmin.emailLower) {
        console.log('⚠️  Missing emailLower field - will add it');
        updates.emailLower = emailLower;
        needsUpdate = true;
      }
      
      if (existingAdmin.role !== 'admin') {
        console.log('⚠️  Role is not admin - will fix it');
        updates.role = 'admin';
        needsUpdate = true;
      }
      
      if (!existingAdmin.email) {
        console.log('⚠️  Missing email field - will add it');
        updates.email = ADMIN_EMAIL;
        needsUpdate = true;
      }
      
      if (!existingAdmin.name) {
        console.log('⚠️  Missing name field - will add it');
        updates.name = ADMIN_NAME;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log('\n🔧 Updating admin user with missing fields...');
        await db.collection('users').updateOne(
          { id: existingAdmin.id },
          { $set: updates }
        );
        console.log('✅ Admin user updated successfully\n');
      } else {
        console.log('✅ Admin user has all required fields\n');
      }
      
    } else {
      console.log('❌ Admin user not found in database');
      console.log('📝 Creating new admin user...\n');
      
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      const adminUser = {
        id: uuidv4(),
        email: ADMIN_EMAIL,
        emailLower,
        password: hashedPassword,
        name: ADMIN_NAME,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      
      await db.collection('users').insertOne(adminUser);
      
      console.log('✅ Admin user created successfully!\n');
      console.log('📝 Admin credentials:');
      console.log('   Email:', ADMIN_EMAIL);
      console.log('   Password:', ADMIN_PASSWORD);
      console.log('   ID:', adminUser.id);
      console.log();
    }
    
    // Create index for emailLower if it doesn't exist
    console.log('🔧 Ensuring database indexes...');
    try {
      await db.collection('users').createIndex({ emailLower: 1 }, { unique: true });
      console.log('✅ Email index created/verified\n');
    } catch (error) {
      if (error.code === 11000) {
        console.log('✅ Email index already exists\n');
      } else {
        console.log('⚠️  Could not create index:', error.message, '\n');
      }
    }
    
    // Final verification
    console.log('🔍 Final verification...');
    const verifyAdmin = await db.collection('users').findOne({ emailLower });
    
    if (verifyAdmin && verifyAdmin.role === 'admin') {
      console.log('✅ ADMIN USER VERIFIED AND READY');
      console.log();
      console.log('═══════════════════════════════════════');
      console.log('  You can now login with:');
      console.log('  Email:', ADMIN_EMAIL);
      console.log('  Password:', ADMIN_PASSWORD);
      console.log('═══════════════════════════════════════');
      console.log();
    } else {
      throw new Error('Verification failed - admin user not found after creation');
    }
    
  } finally {
    await client.close();
    console.log('🔌 Database connection closed\n');
  }
}

// Run the script
createAdmin()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  });
