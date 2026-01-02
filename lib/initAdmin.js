/**
 * Admin User Initialization Script
 * 
 * This script ensures an admin user always exists in the database.
 * It runs automatically on server startup and can be run manually.
 * 
 * Admin credentials are read from environment variables:
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 */

import { connectToDatabase } from './db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Read from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'perfectcellstore@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = 'Perfect Cell Admin';

// Validate required environment variables
if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD environment variable is required');
}

export async function ensureAdminExists() {
  try {
    console.log('[Admin Init] Checking admin user...');
    
    const { db } = await connectToDatabase();
    
    // Normalize email for consistent lookup
    const emailLower = ADMIN_EMAIL.toLowerCase().trim();
    
    // Check if admin user exists
    const existingAdmin = await db.collection('users').findOne({
      $or: [
        { emailLower },
        { email: ADMIN_EMAIL },
        { email: { $regex: `^${ADMIN_EMAIL}$`, $options: 'i' } }
      ]
    });
    
    if (existingAdmin) {
      console.log('[Admin Init] ✅ Admin user already exists');
      
      // Ensure admin user has all required fields (migration/fix)
      const updates = {};
      let needsUpdate = false;
      
      if (!existingAdmin.emailLower) {
        updates.emailLower = emailLower;
        needsUpdate = true;
      }
      
      if (existingAdmin.role !== 'admin') {
        updates.role = 'admin';
        needsUpdate = true;
      }
      
      if (!existingAdmin.email) {
        updates.email = ADMIN_EMAIL;
        needsUpdate = true;
      }
      
      if (!existingAdmin.name) {
        updates.name = ADMIN_NAME;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log('[Admin Init] 🔧 Updating admin user with missing fields...');
        await db.collection('users').updateOne(
          { id: existingAdmin.id },
          { $set: updates }
        );
        console.log('[Admin Init] ✅ Admin user updated successfully');
      }
      
      return existingAdmin;
    }
    
    // Create new admin user
    console.log('[Admin Init] 📝 Creating new admin user...');
    
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
    
    console.log('[Admin Init] ✅ Admin user created successfully');
    console.log('[Admin Init] Email:', ADMIN_EMAIL);
    console.log('[Admin Init] Password:', ADMIN_PASSWORD);
    
    return adminUser;
    
  } catch (error) {
    console.error('[Admin Init] ❌ Error ensuring admin exists:', error);
    throw error;
  }
}

// If run directly (for manual execution)
if (import.meta.url === `file://${process.argv[1]}`) {
  ensureAdminExists()
    .then(() => {
      console.log('[Admin Init] Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('[Admin Init] Script failed:', error);
      process.exit(1);
    });
}
