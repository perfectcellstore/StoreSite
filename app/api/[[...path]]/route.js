import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Enforce JWT_SECRET from environment
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Admin auto-initialization - read from environment
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'perfectcellstore@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD environment variable is required');
}
const ADMIN_CHECK_INTERVAL_MS = 60000; // Check every 60 seconds
let lastAdminCheckTime = 0;

async function ensureAdminUserExists(db) {
  // Rate limit admin checks to avoid database overhead
  const now = Date.now();
  const timeSinceLastCheck = now - lastAdminCheckTime;
  
  if (timeSinceLastCheck < ADMIN_CHECK_INTERVAL_MS) {
    // Skip check if we verified admin recently
    return;
  }
  
  try {
    const emailLower = ADMIN_EMAIL.toLowerCase().trim();
    
    console.log('[Admin Init] Checking admin user existence...');
    const existingAdmin = await db.collection('users').findOne({
      $or: [
        { emailLower },
        { email: { $regex: `^${ADMIN_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }
      ]
    });
    
    if (!existingAdmin) {
      console.log('[Admin Init] Creating admin user...');
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      await db.collection('users').insertOne({
        id: uuidv4(),
        email: ADMIN_EMAIL,
        emailLower,
        password: hashedPassword,
        name: 'Perfect Cell Admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      
      console.log('[Admin Init] ✅ Admin user created successfully');
      lastAdminCheckTime = now;
    } else {
      // Ensure admin has all required fields
      const updates = {};
      if (!existingAdmin.emailLower) updates.emailLower = emailLower;
      if (existingAdmin.role !== 'admin') updates.role = 'admin';
      
      if (Object.keys(updates).length > 0) {
        await db.collection('users').updateOne({ id: existingAdmin.id }, { $set: updates });
        console.log('[Admin Init] ✅ Admin user updated with missing fields');
      } else {
        console.log('[Admin Init] ✅ Admin user exists and is properly configured');
      }
      
      lastAdminCheckTime = now;
    }
    
  } catch (error) {
    console.error('[Admin Init] ❌ Error:', error.message);
    // Don't throw - allow app to continue even if admin check fails
    // Admin can still log in if they exist in database
  }
}

// Helper function to log login attempts
async function logLoginAttempt(db, { email, userId, success, ip, userAgent, errorReason }) {
  try {
    const loginLog = {
      id: uuidv4(),
      email: email?.toLowerCase().trim(),
      userId,
      success,
      ip,
      userAgent,
      errorReason: errorReason || null,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    await db.collection('login_logs').insertOne(loginLog);
    console.log(`[Login Log] ${success ? '✅ SUCCESS' : '❌ FAILURE'} - ${email} from ${ip}`);
    return loginLog;
  } catch (error) {
    console.error('[Login Log] Failed to log login attempt:', error.message);
    // Don't throw - login tracking shouldn't break the login flow
  }
}

// Helper function to create a notification
async function createNotification(db, { userId, title, titleAr, message, messageAr, type }) {
  const notification = {
    id: uuidv4(),
    userId,
    title,
    titleAr,
    message,
    messageAr,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  await db.collection('notifications').insertOne(notification);
  return notification;
}

// Helper function to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}


// -----------------------------
// Auth hardening helpers
// -----------------------------
const AUTH_RATE_LIMIT_MAX_FAILS = 5;
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function isValidEmail(email) {
  // Basic RFC-like validation (practical, not overly strict)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  const p = String(password || '');
  // Reject passwords that are only whitespace
  if (!p.trim()) return false;
  // Min length is enforced separately, but keep it safe here too
  if (p.length < 8) return false;
  // Must contain at least 1 letter and 1 number
  const hasLetter = /[A-Za-z]/.test(p);
  const hasNumber = /\d/.test(p);
  return hasLetter && hasNumber;
}


function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    // first value is original client
    return xff.split(',')[0]?.trim() || 'unknown';
  }
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();
  return 'unknown';
}

let authIndexesEnsured = false;
async function ensureAuthIndexes(db) {
  if (authIndexesEnsured) return;

  // Unique emailLower prevents duplicate accounts regardless of email casing.
  await db.collection('users').createIndex({ emailLower: 1 }, { unique: true });

  // Rate-limit docs expire automatically (cleanup). We update updatedAt on every change.
  await db.collection('auth_rate_limits').createIndex(
    { updatedAt: 1 },
    { expireAfterSeconds: 60 * 60 }
  );

  authIndexesEnsured = true;
}

async function getAuthRateLimit(db, key) {
  const doc = await db.collection('auth_rate_limits').findOne({ key });
  return doc || null;
}

async function recordAuthFailure(db, key) {
  const now = Date.now();
  const nowIso = new Date(now).toISOString();

  const existing = await db.collection('auth_rate_limits').findOne({ key });

  if (!existing) {
    await db.collection('auth_rate_limits').insertOne({
      id: uuidv4(),
      key,
      failedCount: 1,
      firstFailedAt: now,
      lockedUntil: null,
      updatedAt: nowIso,
    });
    return;
  }

  const windowStart = existing.firstFailedAt || now;
  const inWindow = now - windowStart <= AUTH_RATE_LIMIT_WINDOW_MS;
  const nextFailedCount = inWindow ? (existing.failedCount || 0) + 1 : 1;

  const lockedUntil =
    nextFailedCount >= AUTH_RATE_LIMIT_MAX_FAILS
      ? now + AUTH_RATE_LIMIT_WINDOW_MS
      : existing.lockedUntil || null;

  await db.collection('auth_rate_limits').updateOne(
    { key },
    {
      $set: {
        failedCount: nextFailedCount,
        firstFailedAt: inWindow ? windowStart : now,
        lockedUntil,
        updatedAt: nowIso,
      },
    }
  );
}

async function clearAuthFailures(db, key) {
  await db.collection('auth_rate_limits').deleteOne({ key });
}

// GET Handler
export async function GET(request, { params }) {
  const { path } = params;
  const pathname = path ? path.join('/') : '';
  
  try {
    const { db } = await connectToDatabase();
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Health Check Endpoint
    if (pathname === 'health') {
      try {
        // Check database connection
        const { checkDatabaseHealth } = await import('@/lib/db');
        const dbHealth = await checkDatabaseHealth();
        
        // Check user collection
        const userCount = await db.collection('users').countDocuments();
        const adminEmailLower = (ADMIN_EMAIL || 'perfectcellstore@gmail.com').toLowerCase();
        const adminExists = await db.collection('users').findOne({ 
          emailLower: adminEmailLower
        });
        
        return NextResponse.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: {
            connected: dbHealth.connected,
            name: dbHealth.database,
            userCount,
            adminAccountExists: !!adminExists
          },
          uptime: process.uptime()
        });
      } catch (healthError) {
        console.error('[Health] Health check failed:', healthError.message);
        return NextResponse.json({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: healthError.message
        }, { status: 503 });
      }
    }

    // Auth Routes
    if (pathname === 'auth/me') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const { password, ...userWithoutPassword } = user;
      return NextResponse.json({ user: userWithoutPassword });
    }

    // Get Product Reviews (must come before general product routes)
    if (pathname.match(/^products\/[\w-]+\/reviews$/)) {
      const productId = pathname.split('/')[1];
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '100');
      const skip = (page - 1) * limit;
      
      const totalCount = await db.collection('reviews').countDocuments({ productId });
      const reviews = await db.collection('reviews')
        .find({ productId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      return NextResponse.json({ 
        reviews,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    }

    // Products Routes
    if (pathname === 'products') {
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const sort = searchParams.get('sort');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '100');
      const skip = (page - 1) * limit;
      
      let query = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Get total count for pagination
      const totalCount = await db.collection('products').countDocuments(query);
      
      let products = await db.collection('products')
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();
      
      // Sorting
      if (sort === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'name') {
        products.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      return NextResponse.json({ 
        products,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    }

    if (pathname.startsWith('products/')) {
      const productId = pathname.split('/')[1];
      const product = await db.collection('products').findOne({ id: productId });
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      return NextResponse.json({ product });
    }

    // Categories Route
    if (pathname === 'categories') {
      const categories = [
        { id: 'collectibles', name: 'Collectibles', nameAr: 'المقتنيات' },
        { id: 'historical', name: 'Historical Items', nameAr: 'القطع التاريخية' },
        { id: 'cosplay', name: 'Cosplay & Gear', nameAr: 'الأزياء والمعدات' },
        { id: 'weapons', name: 'Weapon Replicas', nameAr: 'نسخ الأسلحة' },
        { id: 'figures', name: 'Figures & Statues', nameAr: 'التماثيل والمجسمات' },
        { id: 'masks', name: 'Masks', nameAr: 'الأقنعة' },
        { id: 'toys', name: 'Toys', nameAr: 'الألعاب' },
        { id: 'rare', name: 'Rare Items', nameAr: 'القطع النادرة' }
      ];
      return NextResponse.json({ categories });
    }

    // Collections Route (GET - Public)
    if (pathname === 'collections') {
      const collections = await db.collection('collections')
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
      return NextResponse.json({ collections });
    }

    // Orders Routes
    if (pathname === 'orders') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const user = await db.collection('users').findOne({ id: decoded.userId });

      const url = new URL(request.url);
      const search = (url.searchParams.get('search') || '').trim();
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '100');
      const skip = (page - 1) * limit;

      let query = {};
      if (user?.role !== 'admin') {
        query.userId = decoded.userId;
      } else if (search) {
        // Admin: allow partial search by order id (contains)
        query.id = { $regex: escapeRegExp(search), $options: 'i' };
      }

      const totalCount = await db.collection('orders').countDocuments(query);
      const orders = await db.collection('orders')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      return NextResponse.json({ 
        orders,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    }

    if (pathname.startsWith('orders/')) {
      const orderId = pathname.split('/')[1];
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const order = await db.collection('orders').findOne({ id: orderId });
      
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId });
      if (order.userId !== decoded.userId && user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      return NextResponse.json({ order });
    }

    // Admin Stats
    if (pathname === 'admin/stats') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId });
      if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      const productsCount = await db.collection('products').countDocuments();
      const ordersCount = await db.collection('orders').countDocuments();
      const usersCount = await db.collection('users').countDocuments();
      
      // Use aggregation to calculate total revenue efficiently
      const revenueResult = await db.collection('orders').aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' }
          }
        }
      ]).toArray();
      
      const totalRevenue = revenueResult[0]?.totalRevenue || 0;
      
      return NextResponse.json({
        stats: {
          productsCount,
          ordersCount,
          usersCount,
          totalRevenue
        }
      });
    }

    // Admin Login Logs Route
    if (pathname === 'admin/login-logs') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId });
      if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      // Get query parameters for pagination and filtering
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const skip = parseInt(url.searchParams.get('skip') || '0');
      const successFilter = url.searchParams.get('success'); // 'true', 'false', or null for all
      
      // Build query
      const query = {};
      if (successFilter === 'true') query.success = true;
      if (successFilter === 'false') query.success = false;
      
      // Get login logs
      const loginLogs = await db.collection('login_logs')
        .find(query)
        .sort({ timestamp: -1 })
        .limit(Math.min(limit, 500)) // Max 500 at a time
        .skip(skip)
        .toArray();
      
      const totalCount = await db.collection('login_logs').countDocuments(query);
      
      return NextResponse.json({
        loginLogs,
        pagination: {
          total: totalCount,
          limit,
          skip,
          hasMore: skip + loginLogs.length < totalCount
        }
      });
    }

    // Notifications Routes
    if (pathname === 'notifications') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const notifications = await db.collection('notifications')
        .find({ userId: decoded.userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
      
      return NextResponse.json({ notifications });
    }

    // Get Store Customization (Admin Only)
    if (pathname === 'customization') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId });
      if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      let customization = await db.collection('customization').findOne({ storeId: 'default' });
      
      // Return default customization if none exists
      if (!customization) {
        customization = {
          storeId: 'default',
          colors: {
            primary: '#10b981',
            secondary: '#1f2937',
            accent: '#3b82f6',
            background: '#0a0a0a',
            backgroundSecondary: '#1a1a1a',
            buttonNormal: '#10b981',
            buttonHover: '#059669',
            textHeading: '#ffffff',
            textBody: '#d1d5db',
            textLink: '#10b981',
          },
          typography: {
            fontFamily: 'Inter, system-ui, sans-serif',
            headingSize: '2.5rem',
            bodySize: '1rem',
            textAlign: 'center',
          },
          content: {
            heroTitle: 'Perfect Sell',
            heroSubtitle: 'Evolve Your Collection',
            heroDescription: 'Discover epic collectibles, awesome replicas, and legendary gear that bring your favorite characters to life!',
            featureTitle1: 'Authentic Quality',
            featureDesc1: 'Every item verified for authenticity and premium quality',
            featureTitle2: 'Fast Delivery',
            featureDesc2: 'Quick and secure delivery to your location',
            featureTitle3: 'Rare Finds',
            featureDesc3: 'Exclusive and limited edition collectibles',
          },
          images: {
            logo: '',
            heroBanner: '',
            aboutBanner: '',
          },
          layout: {
            showHeroSection: true,
            showFeaturesSection: true,
            showCategoriesSection: true,
            showAboutSection: true,
            heroSpacing: 'normal',
            sectionSpacing: 'normal',
          },
          animation: {
            enabled: true,
            intensity: 'medium',
            speed: 'medium',
            opacity: 0.3,
            placement: 'global',
          },
        };
      }
      
      return NextResponse.json({ customization });
    }

    // Get Store Customization (Public - for frontend)
    if (pathname === 'customization/public') {
      let customization = await db.collection('customization').findOne({ storeId: 'default' });
      
      // Return default if none exists
      if (!customization) {
        customization = {
          colors: {
            primary: '#10b981',
            secondary: '#1f2937',
            accent: '#3b82f6',
            background: '#0a0a0a',
            backgroundSecondary: '#1a1a1a',
            buttonNormal: '#10b981',
            buttonHover: '#059669',
            textHeading: '#ffffff',
            textBody: '#d1d5db',
            textLink: '#10b981',
          },
          typography: {
            fontFamily: 'Inter, system-ui, sans-serif',
            headingSize: '2.5rem',
            bodySize: '1rem',
            textAlign: 'center',
          },
          content: {
            heroTitle: 'Perfect Sell',
            heroSubtitle: 'Evolve Your Collection',
            heroDescription: 'Discover epic collectibles, awesome replicas, and legendary gear that bring your favorite characters to life!',
            featureTitle1: 'Authentic Quality',
            featureDesc1: 'Every item verified for authenticity and premium quality',
            featureTitle2: 'Fast Delivery',
            featureDesc2: 'Quick and secure delivery to your location',
            featureTitle3: 'Rare Finds',
            featureDesc3: 'Exclusive and limited edition collectibles',
          },
          images: {
            logo: '',
            heroBanner: '',
            aboutBanner: '',
          },
          layout: {
            showHeroSection: true,
            showFeaturesSection: true,
            showCategoriesSection: true,
            showAboutSection: true,
            heroSpacing: 'normal',
            sectionSpacing: 'normal',
          },
          animation: {
            enabled: true,
            intensity: 'medium',
            speed: 'medium',
            opacity: 0.3,
            placement: 'global',
          },
        };
      }
      
      return NextResponse.json({ customization });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST Handler
export async function POST(request, { params }) {
  const { path } = params;
  const pathname = path ? path.join('/') : '';
  
  try {
    const { db } = await connectToDatabase();
    
    // File Upload Route
    if (pathname === 'upload') {
      try {
        const formData = await request.formData();
        const file = formData.get('file');
        
        if (!file) {
          return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
        }
        
        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
        }
        
        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}-${randomStr}.${extension}`;
        
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Save to public/uploads directory
        const fs = require('fs').promises;
        const path = require('path');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, filename);
        
        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true });
        
        // Write file
        await fs.writeFile(filePath, buffer);
        
        // Return public URL
        const url = `/uploads/${filename}`;
        
        console.log('[Upload] File uploaded successfully:', url);
        return NextResponse.json({ url, filename });
        
      } catch (error) {
        console.error('[Upload] Error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
      }
    }
    
    const body = await request.json();

    // Auth Routes
    if (pathname === 'auth/register') {
      try {
        console.log('[Register] Registration attempt for:', body?.email);
        
        // Ensure database indexes
        try {
          await ensureAuthIndexes(db);
          console.log('[Register] Auth indexes verified');
        } catch (dbError) {
          console.error('[Register] ❌ Database index error:', dbError.message);
          return NextResponse.json({ 
            error: 'Database connection error. Please try again in a moment.',
            errorCode: 'DB_INDEX_ERROR'
          }, { status: 503 });
        }

        const { email, password, name } = body;

        const normalizedEmail = (email || '').trim();
        const emailLower = normalizedEmail.toLowerCase();
        const normalizedName = (name || '').trim();

        if (!normalizedEmail || !password || !normalizedName) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!isValidEmail(emailLower)) {
          return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        if (String(password).length < 8) {
          return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        if (!isStrongPassword(password)) {
          return NextResponse.json(
            { error: 'Password must contain at least 1 letter and 1 number' },
            { status: 400 }
          );
        }

        // Check if user already exists
        try {
          const existingUser = await db.collection('users').findOne({ emailLower });
          if (existingUser) {
            console.log('[Register] User already exists:', emailLower);
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
          }
        } catch (findError) {
          console.error('[Register] ❌ Database query error:', findError.message);
          return NextResponse.json({ 
            error: 'Database error while checking user existence. Please try again.',
            errorCode: 'DB_QUERY_ERROR'
          }, { status: 503 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        const user = {
          id: userId,
          email: normalizedEmail,
          emailLower,
          password: hashedPassword,
          name: normalizedName,
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        try {
          console.log('[Register] Creating new user:', emailLower);
          await db.collection('users').insertOne(user);
          console.log('[Register] ✅ User created successfully:', emailLower);
        } catch (e) {
          // Duplicate key error for unique index
          if (e?.code === 11000) {
            console.log('[Register] Duplicate key error for:', emailLower);
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
          }
          console.error('[Register] ❌ Database insert error:', e.message);
          return NextResponse.json({ 
            error: 'Failed to create user account. Please try again.',
            errorCode: 'DB_INSERT_ERROR'
          }, { status: 500 });
        }

        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

        const { password: _, ...userWithoutPassword } = user;
        console.log('[Register] ✅ Registration successful:', emailLower);
        return NextResponse.json({ token, user: userWithoutPassword });
        
      } catch (error) {
        console.error('[Register] ❌ Unexpected error:', error.message);
        return NextResponse.json({ 
          error: 'An unexpected error occurred during registration. Please try again.',
          errorCode: 'UNEXPECTED_ERROR'
        }, { status: 500 });
      }
    }

    if (pathname === 'auth/login') {
      try {
        console.log('[Login] Login attempt started for:', body?.email);
        
        // First, ensure database connection is healthy
        try {
          await ensureAuthIndexes(db);
          console.log('[Login] Auth indexes verified');
        } catch (dbError) {
          console.error('[Login] ❌ Database index error:', dbError.message);
          return NextResponse.json({ 
            error: 'Database connection error. Please try again in a moment.',
            errorCode: 'DB_INDEX_ERROR'
          }, { status: 503 });
        }
        
        // Ensure admin user exists
        try {
          await ensureAdminUserExists(db);
          console.log('[Login] Admin user check complete');
        } catch (adminError) {
          console.error('[Login] ⚠️ Admin initialization error:', adminError.message);
          // Continue with login even if admin init fails
        }

        const { email, password } = body;

        const normalizedEmail = (email || '').trim();
        const emailLower = normalizedEmail.toLowerCase();

        if (!normalizedEmail || !password) {
          console.log('[Login] Missing credentials');
          return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        if (!isValidEmail(emailLower)) {
          console.log('[Login] Invalid email format:', emailLower);
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const ip = getClientIp(request);
        const rateKey = `login:${ip}:${emailLower}`;

        // Check rate limiting
        try {
          const limiter = await getAuthRateLimit(db, rateKey);
          if (limiter?.lockedUntil && Date.now() < limiter.lockedUntil) {
            const retryAfterSeconds = Math.max(1, Math.ceil((limiter.lockedUntil - Date.now()) / 1000));
            console.log('[Login] Rate limited:', emailLower);
            return NextResponse.json(
              {
                error: 'Too many login attempts. Please try again later.',
                retryAfterSeconds,
              },
              {
                status: 429,
                headers: {
                  'Retry-After': String(retryAfterSeconds),
                },
              }
            );
          }
        } catch (rateLimitError) {
          console.error('[Login] Rate limit check error:', rateLimitError.message);
          // Continue with login if rate limit check fails
        }

        // Find user in database
        let user;
        try {
          console.log('[Login] Searching for user:', emailLower);
          user = await db.collection('users').findOne({
            $or: [
              { emailLower },
              { email: { $regex: `^${escapeRegExp(emailLower)}$`, $options: 'i' } },
            ],
          });
          console.log('[Login] User search result:', user ? `Found (ID: ${user.id})` : 'Not found');
        } catch (findError) {
          console.error('[Login] ❌ Database query error:', findError.message);
          return NextResponse.json({ 
            error: 'Database error while searching for user. Please try again.',
            errorCode: 'DB_QUERY_ERROR'
          }, { status: 503 });
        }

        if (!user) {
          console.log('[Login] User not found:', emailLower);
          
          // Log failed login attempt
          const userAgent = request.headers.get('user-agent') || 'Unknown';
          await logLoginAttempt(db, {
            email: normalizedEmail,
            userId: null,
            success: false,
            ip,
            userAgent,
            errorReason: 'User not found'
          });
          
          try {
            await recordAuthFailure(db, rateKey);
          } catch (e) {
            console.error('[Login] Failed to record auth failure:', e.message);
          }
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        let validPassword;
        try {
          validPassword = await bcrypt.compare(password, user.password);
        } catch (bcryptError) {
          console.error('[Login] ❌ Password comparison error:', bcryptError.message);
          return NextResponse.json({ 
            error: 'Authentication error. Please try again.',
            errorCode: 'AUTH_ERROR'
          }, { status: 500 });
        }

        if (!validPassword) {
          console.log('[Login] Invalid password for:', emailLower);
          
          // Log failed login attempt
          const userAgent = request.headers.get('user-agent') || 'Unknown';
          await logLoginAttempt(db, {
            email: normalizedEmail,
            userId: user.id,
            success: false,
            ip,
            userAgent,
            errorReason: 'Invalid password'
          });
          
          try {
            await recordAuthFailure(db, rateKey);
          } catch (e) {
            console.error('[Login] Failed to record auth failure:', e.message);
          }
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Clear auth failures on successful login
        try {
          await clearAuthFailures(db, rateKey);
        } catch (e) {
          console.error('[Login] Failed to clear auth failures:', e.message);
          // Continue with login
        }

        // If user is legacy (missing emailLower), backfill it (best-effort)
        if (!user.emailLower) {
          try {
            await db.collection('users').updateOne(
              { id: user.id },
              { $set: { emailLower } }
            );
            console.log('[Login] Backfilled emailLower for:', emailLower);
          } catch (e) {
            console.error('[Login] Backfill error:', e.message);
            // ignore backfill errors to avoid breaking login
          }
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Log successful login
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        await logLoginAttempt(db, {
          email: normalizedEmail,
          userId: user.id,
          success: true,
          ip,
          userAgent,
          errorReason: null
        });

        const { password: _, ...userWithoutPassword } = user;
        console.log('[Login] ✅ Success:', emailLower, 'Role:', user.role);
        return NextResponse.json({ token, user: userWithoutPassword });
        
      } catch (error) {
        console.error('[Login] ❌ Unexpected error:', error.message);
        console.error('[Login] Stack trace:', error.stack);
        return NextResponse.json({ 
          error: 'An unexpected error occurred during login. Please try again.',
          errorCode: 'UNEXPECTED_ERROR',
          errorMessage: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
      }
    }

    // Products Routes
    if (pathname === 'products') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId });
      if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      const product = {
        id: uuidv4(),
        ...body,
        createdAt: new Date().toISOString()
      };
      
      await db.collection('products').insertOne(product);
      return NextResponse.json({ product });
    }

    // Orders Routes
    if (pathname === 'orders') {
      const { items, shippingInfo, total, userId } = body;
      
      if (!items || items.length === 0 || !shippingInfo) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      
      const order = {
        id: uuidv4(),
        userId: userId || null,
        items,
        shippingInfo,
        total,
        status: 'pending',
        paymentMethod: 'cash_on_delivery',
        createdAt: new Date().toISOString()
      };
      
      await db.collection('orders').insertOne(order);
      
      // Create notification for admin about new order
      const adminUser = await db.collection('users').findOne({ email: ADMIN_EMAIL });
      if (adminUser) {
        await createNotification(db, {
          userId: adminUser.id,
          title: 'New Order Received!',
          titleAr: 'طلب جديد!',
          message: `Order #${order.id.slice(0, 8)} - Total: ${total} IQD from ${shippingInfo.name}`,
          messageAr: `طلب #${order.id.slice(0, 8)} - المجموع: ${total} IQD من ${shippingInfo.name}`,
          type: 'order'
        });
      }
      
      // Create notification for user (if logged in)
      if (userId) {
        await createNotification(db, {
          userId,
          title: 'Order Placed Successfully!',
          titleAr: 'تم تقديم الطلب بنجاح!',
          message: `Your order #${order.id.slice(0, 8)} has been placed. We'll notify you when it ships!`,
          messageAr: `تم تقديم طلبك #${order.id.slice(0, 8)}. سنخطرك عند الشحن!`,
          type: 'order_status'
        });
      }
      
      return NextResponse.json({ order });
    }

    // Newsletter Subscription
    if (pathname === 'newsletter/subscribe') {
      const { email } = body;
      
      if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
      }
      
      // Check if already subscribed
      const existing = await db.collection('subscribers').findOne({ email });
      if (existing) {
        return NextResponse.json({ message: 'Already subscribed!' });
      }
      
      // Add subscriber
      const subscriber = {
        id: uuidv4(),
        email,
        subscribedAt: new Date().toISOString(),
        active: true
      };
      
      await db.collection('subscribers').insertOne(subscriber);
      
      // Notify admin about new subscriber
      const adminUser = await db.collection('users').findOne({ email: 'perfectcellstore@gmail.com' });
      if (adminUser) {
        await createNotification(db, {
          userId: adminUser.id,
          title: 'New Newsletter Subscriber!',
          titleAr: 'مشترك جديد في النشرة الإخبارية!',
          message: `${email} subscribed to the newsletter`,
          messageAr: `${email} اشترك في النشرة الإخبارية`,
          type: 'subscriber'
        });
      }
      
      return NextResponse.json({ message: 'Subscribed successfully!' });
    }

    // Collections Management (Admin Only)
    if (pathname === 'collections') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId });
      if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const collection = {
        id: uuidv4(),
        ...body,
        createdAt: new Date().toISOString()
      };

      await db.collection('collections').insertOne(collection);
      return NextResponse.json({ collection });
    }

    // Save Store Customization (Admin Only)
    if (pathname === 'customization') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId });
      if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      // Remove _id and storeId from body to prevent MongoDB errors
      const { _id, storeId, ...customizationFields } = body;
      
      const customizationData = {
        storeId: 'default',
        ...customizationFields,
        updatedAt: new Date().toISOString(),
        updatedBy: decoded.userId
      };
      
      await db.collection('customization').updateOne(
        { storeId: 'default' },
        { $set: customizationData },
        { upsert: true }
      );
      
      return NextResponse.json({ success: true, customization: customizationData });
    }

    // Reset Store Customization to Defaults (Admin Only)
    if (pathname === 'customization/reset') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId });
      if (user?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      const defaultCustomization = {
        storeId: 'default',
        colors: {
          primary: '#10b981',
          secondary: '#1f2937',
          accent: '#3b82f6',
          background: '#0a0a0a',
          backgroundSecondary: '#1a1a1a',
          buttonNormal: '#10b981',
          buttonHover: '#059669',
          textHeading: '#ffffff',
          textBody: '#d1d5db',
          textLink: '#10b981',
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          headingSize: '2.5rem',
          bodySize: '1rem',
          textAlign: 'center',
        },
        content: {
          heroTitle: 'Perfect Sell',
          heroSubtitle: 'Evolve Your Collection',
          heroDescription: 'Discover epic collectibles, awesome replicas, and legendary gear that bring your favorite characters to life!',
          featureTitle1: 'Authentic Quality',
          featureDesc1: 'Every item verified for authenticity and premium quality',
          featureTitle2: 'Fast Delivery',
          featureDesc2: 'Quick and secure delivery to your location',
          featureTitle3: 'Rare Finds',
          featureDesc3: 'Exclusive and limited edition collectibles',
        },
        images: {
          logo: '',
          heroBanner: '',
          aboutBanner: '',
        },
        layout: {
          showHeroSection: true,
          showFeaturesSection: true,
          showCategoriesSection: true,
          showAboutSection: true,
          heroSpacing: 'normal',
          sectionSpacing: 'normal',
        },
        animation: {
          enabled: true,
          intensity: 'medium',
          speed: 'medium',
          opacity: 0.3,
          placement: 'global',
        },
        resetAt: new Date().toISOString(),
        resetBy: decoded.userId
      };
      
      await db.collection('customization').updateOne(
        { storeId: 'default' },
        { $set: defaultCustomization },
        { upsert: true }
      );
      
      return NextResponse.json({ success: true, customization: defaultCustomization });
    }

    // Submit Product Review
    if (pathname.match(/^products\/[\w-]+\/reviews$/)) {
      const productId = pathname.split('/')[1];
      const { rating, reviewText, reviewerName } = body;
      
      if (!rating || !reviewText || !reviewerName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      
      if (rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
      }
      
      const review = {
        id: uuidv4(),
        productId,
        rating: parseInt(rating),
        reviewText: reviewText.trim(),
        reviewerName: reviewerName.trim(),
        hidden: false,
        createdAt: new Date().toISOString()
      };
      
      // Save the review
      await db.collection('reviews').insertOne(review);
      
      // Calculate aggregate rating for the product
      const allReviews = await db.collection('reviews')
        .find({ productId })
        .toArray();
      
      const totalReviews = allReviews.length;
      const averageRating = totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
      
      // Update product with aggregate data
      await db.collection('products').updateOne(
        { id: productId },
        { 
          $set: { 
            reviewCount: totalReviews,
            averageRating: parseFloat(averageRating.toFixed(1))
          } 
        }
      );
      
      return NextResponse.json({ 
        success: true, 
        review,
        aggregateData: {
          reviewCount: totalReviews,
          averageRating: parseFloat(averageRating.toFixed(1))
        }
      });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT Handler
export async function PUT(request, { params }) {
  const { path } = params;
  const pathname = path ? path.join('/') : '';
  
  try {
    const { db } = await connectToDatabase();
    const decoded = verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Notification Routes (user accessible)
    if (pathname.startsWith('notifications/') && pathname.endsWith('/read')) {
      const notificationId = pathname.split('/')[1];
      
      await db.collection('notifications').updateOne(
        { id: notificationId, userId: decoded.userId },
        { $set: { read: true } }
      );
      
      return NextResponse.json({ success: true });
    }
    
    if (pathname === 'notifications/read-all') {
      await db.collection('notifications').updateMany(
        { userId: decoded.userId },
        { $set: { read: true } }
      );
      
      return NextResponse.json({ success: true });
    }
    
    // Admin-only routes below
    const body = await request.json();
    const user = await db.collection('users').findOne({ id: decoded.userId });
    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Toggle Review Visibility (Admin Only) - Must come before general product routes
    if (pathname.match(/^products\/[\w-]+\/reviews\/[\w-]+\/toggle$/)) {
      const productId = pathname.split('/')[1];
      const reviewId = pathname.split('/')[3];
      
      // Update review visibility
      await db.collection('reviews').updateOne(
        { id: reviewId },
        { $set: { hidden: body.hidden } }
      );
      
      // Recalculate aggregate rating excluding hidden reviews
      const allReviews = await db.collection('reviews')
        .find({ productId, hidden: false })
        .toArray();
      
      const totalReviews = allReviews.length;
      const averageRating = totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
      
      // Update product with new aggregate data
      await db.collection('products').updateOne(
        { id: productId },
        { 
          $set: { 
            reviewCount: totalReviews,
            averageRating: parseFloat(averageRating.toFixed(1))
          } 
        }
      );
      
      return NextResponse.json({ 
        success: true,
        aggregateData: {
          reviewCount: totalReviews,
          averageRating: parseFloat(averageRating.toFixed(1))
        }
      });
    }

    // Update Collection
    if (pathname.startsWith('collections/')) {
      const collectionId = pathname.split('/')[1];
      
      const { id, createdAt, ...updateData } = body;
      
      const result = await db.collection('collections').updateOne(
        { id: collectionId },
        { $set: { ...updateData, updatedAt: new Date().toISOString() } }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
      }
      
      const collection = await db.collection('collections').findOne({ id: collectionId });
      return NextResponse.json({ collection });
    }

    // Update Product
    if (pathname.startsWith('products/') && !pathname.includes('/reviews/')) {
      const productId = pathname.split('/')[1];
      
      const { id, createdAt, ...updateData } = body;
      
      const result = await db.collection('products').updateOne(
        { id: productId },
        { $set: { ...updateData, updatedAt: new Date().toISOString() } }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      const product = await db.collection('products').findOne({ id: productId });
      return NextResponse.json({ product });
    }

    // Update Order Status
    if (pathname.startsWith('orders/')) {
      const orderId = pathname.split('/')[1];
      const { status } = body;
      
      const result = await db.collection('orders').updateOne(
        { id: orderId },
        { $set: { status, updatedAt: new Date().toISOString() } }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      
      const order = await db.collection('orders').findOne({ id: orderId });
      return NextResponse.json({ order });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(request, { params }) {
  const { path } = params;
  const pathname = path ? path.join('/') : '';
  
  try {
    const { db } = await connectToDatabase();
    const decoded = verifyToken(request);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await db.collection('users').findOne({ id: decoded.userId });
    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete Collection
    if (pathname.startsWith('collections/')) {
      const collectionId = pathname.split('/')[1];
      
      const result = await db.collection('collections').deleteOne({ id: collectionId });
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true });
    }

    // Delete Product
    if (pathname.startsWith('products/') && !pathname.includes('/reviews/')) {
      const productId = pathname.split('/')[1];
      
      const result = await db.collection('products').deleteOne({ id: productId });
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true });
    }

    // Delete Review (Admin Only)
    if (pathname.match(/^products\/[\w-]+\/reviews\/[\w-]+$/)) {
      const productId = pathname.split('/')[1];
      const reviewId = pathname.split('/')[3];
      
      const result = await db.collection('reviews').deleteOne({ id: reviewId });
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }
      
      // Recalculate aggregate rating
      const allReviews = await db.collection('reviews')
        .find({ productId })
        .toArray();
      
      const totalReviews = allReviews.length;
      const averageRating = totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
      
      await db.collection('products').updateOne(
        { id: productId },
        { 
          $set: { 
            reviewCount: totalReviews,
            averageRating: parseFloat(averageRating.toFixed(1))
          } 
        }
      );
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
