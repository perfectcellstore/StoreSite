#!/usr/bin/env node

/**
 * Data Sync Script - Syncs products and collections from perfectsell.store
 * to the local preview database
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PRODUCTION_URL = 'https://perfectsell.store';
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to fetch JSON from URL
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Download a file from URL
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function syncData() {
  console.log('🔄 Syncing data from perfectsell.store...\n');
  
  try {
    // Fetch products
    console.log('📦 Fetching products...');
    const productsData = await fetchJSON(`${PRODUCTION_URL}/api/products`);
    const products = productsData.products || [];
    console.log(`   Found ${products.length} products`);
    
    // Fetch collections
    console.log('📁 Fetching collections...');
    const collectionsData = await fetchJSON(`${PRODUCTION_URL}/api/collections`);
    const collections = collectionsData.collections || [];
    console.log(`   Found ${collections.length} collections`);
    
    // Download images
    console.log('\n🖼️  Downloading images...');
    const imageUrls = new Set();
    
    // Collect all image URLs
    products.forEach(p => {
      if (p.image && p.image.startsWith('/uploads/')) {
        imageUrls.add(p.image);
      }
      if (p.images && Array.isArray(p.images)) {
        p.images.forEach(img => {
          if (img && img.startsWith('/uploads/')) {
            imageUrls.add(img);
          }
        });
      }
    });
    
    collections.forEach(c => {
      if (c.image && c.image.startsWith('/uploads/')) {
        imageUrls.add(c.image);
      }
    });
    
    console.log(`   Found ${imageUrls.size} images to download`);
    
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const imgPath of imageUrls) {
      const filename = path.basename(imgPath);
      const localPath = path.join(UPLOADS_DIR, filename);
      
      // Skip if already exists
      if (fs.existsSync(localPath)) {
        skipped++;
        continue;
      }
      
      const fullUrl = `${PRODUCTION_URL}${imgPath}`;
      try {
        await downloadFile(fullUrl, localPath);
        downloaded++;
        console.log(`   ✅ Downloaded: ${filename}`);
      } catch (err) {
        failed++;
        console.log(`   ❌ Failed: ${filename} - ${err.message}`);
      }
    }
    
    console.log(`\n   Summary: ${downloaded} downloaded, ${skipped} skipped (existing), ${failed} failed`);
    
    // Now insert into MongoDB
    console.log('\n💾 Inserting data into MongoDB...');
    
    const { MongoClient } = require('mongodb');
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'perfect_cell_store';
    
    const client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db(dbName);
    
    // Clear existing data
    await db.collection('products').deleteMany({});
    await db.collection('collections').deleteMany({});
    
    // Insert products (clean up MongoDB _id to avoid conflicts)
    const cleanProducts = products.map(p => {
      const { _id, ...rest } = p;
      return rest;
    });
    
    if (cleanProducts.length > 0) {
      await db.collection('products').insertMany(cleanProducts);
      console.log(`   ✅ Inserted ${cleanProducts.length} products`);
    }
    
    // Insert collections
    const cleanCollections = collections.map(c => {
      const { _id, ...rest } = c;
      return rest;
    });
    
    if (cleanCollections.length > 0) {
      await db.collection('collections').insertMany(cleanCollections);
      console.log(`   ✅ Inserted ${cleanCollections.length} collections`);
    }
    
    await client.close();
    
    console.log('\n✨ Sync complete!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

syncData();
