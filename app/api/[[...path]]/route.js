import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'perfect-sell-jwt-secret';

// Admin auto-initialization
const ADMIN_EMAIL = 'perfectcellstore@gmail.com';
const ADMIN_PASSWORD = 'admin123456';
let adminInitialized = false;

async function ensureAdminUserExists(db) {
  if (adminInitialized) return;
  
  try {
    const emailLower = ADMIN_EMAIL.toLowerCase().trim();
    
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
      
      console.log('[Admin Init] ✅ Admin user created');
    } else {
      // Ensure admin has all required fields
      const updates = {};
      if (!existingAdmin.emailLower) updates.emailLower = emailLower;
      if (existingAdmin.role !== 'admin') updates.role = 'admin';
      
      if (Object.keys(updates).length > 0) {
        await db.collection('users').updateOne({ id: existingAdmin.id }, { $set: updates });
        console.log('[Admin Init] ✅ Admin user updated');
      }
    }
    
    adminInitialized = true;
  } catch (error) {
    console.error('[Admin Init] Error:', error.message);
    // Don't throw - allow app to continue
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
      
      const reviews = await db.collection('reviews')
        .find({ productId })
        .sort({ createdAt: -1 })
        .toArray();
      
      return NextResponse.json({ reviews });
    }

    // Products Routes
    if (pathname === 'products') {
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      const sort = searchParams.get('sort');
      
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
      
      let products = await db.collection('products').find(query).toArray();
      
      // Sorting
      if (sort === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'name') {
        products.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      return NextResponse.json({ products });
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

    // Orders Routes
    if (pathname === 'orders') {
      const decoded = verifyToken(request);
      if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const user = await db.collection('users').findOne({ id: decoded.userId });

      const url = new URL(request.url);
      const search = (url.searchParams.get('search') || '').trim();

      let query = {};
      if (user?.role !== 'admin') {
        query.userId = decoded.userId;
      } else if (search) {
        // Admin: allow partial search by order id (contains)
        query.id = { $regex: escapeRegExp(search), $options: 'i' };
      }

      const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ orders });
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
      
      const orders = await db.collection('orders').find({}).toArray();
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      
      return NextResponse.json({
        stats: {
          productsCount,
          ordersCount,
          usersCount,
          totalRevenue
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
    const body = await request.json();

    // Auth Routes
    if (pathname === 'auth/register') {
      await ensureAuthIndexes(db);

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
        await db.collection('users').insertOne(user);
      } catch (e) {
        // Duplicate key error for unique index
        if (e?.code === 11000) {
          return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }
        throw e;
      }

      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({ token, user: userWithoutPassword });
    }

    if (pathname === 'auth/login') {
      await ensureAuthIndexes(db);
      await ensureAdminUserExists(db);

      const { email, password } = body;

      const normalizedEmail = (email || '').trim();
      const emailLower = normalizedEmail.toLowerCase();

      if (!normalizedEmail || !password) {
        return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
      }

      if (!isValidEmail(emailLower)) {
        // Do not leak whether email exists
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const ip = getClientIp(request);
      const rateKey = `login:${ip}:${emailLower}`;

      const limiter = await getAuthRateLimit(db, rateKey);
      if (limiter?.lockedUntil && Date.now() < limiter.lockedUntil) {
        const retryAfterSeconds = Math.max(1, Math.ceil((limiter.lockedUntil - Date.now()) / 1000));
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

      // Backward compatibility: some older users may not have emailLower
      const user = await db.collection('users').findOne({
        $or: [
          { emailLower },
          { email: { $regex: `^${escapeRegExp(emailLower)}$`, $options: 'i' } },
        ],
      });

      if (!user) {
        await recordAuthFailure(db, rateKey);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        await recordAuthFailure(db, rateKey);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      await clearAuthFailures(db, rateKey);

      // If user is legacy (missing emailLower), backfill it (best-effort)
      if (!user.emailLower) {
        try {
          await db.collection('users').updateOne(
            { id: user.id },
            { $set: { emailLower } }
          );
        } catch (e) {
          // ignore backfill errors to avoid breaking login
        }
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({ token, user: userWithoutPassword });
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
      const adminUser = await db.collection('users').findOne({ email: 'perfectcellstore@gmail.com' });
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
