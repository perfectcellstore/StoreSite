# Perfect Sell - Premium E-Commerce Platform

![Perfect Sell](https://img.shields.io/badge/Perfect%20Sell-Evolve%20Your%20Collection-22c55e?style=for-the-badge)

## 🌟 Overview

**Perfect Sell** is a premium, full-featured e-commerce platform specializing in collectibles, historical items, cosplay gear, weapon replicas, figures, masks, and rare items. Built with a unique **Dark Luxury × Sci-Fi** aesthetic inspired by evolution and power.

### Live Preview
🔗 **URL**: https://nextjs-store-4.preview.emergentagent.com

---

## ✨ Key Features

### 🛍️ E-Commerce Features
- **Full Product Catalog** - Browse and search products with filters
- **Product Details** - Detailed product pages with multiple images
- **Shopping Cart** - Add, remove, and update quantities
- **Checkout System** - Complete order placement with shipping info
- **Order Management** - Track order status and history
- **Cash on Delivery** - Primary payment method (Qi Card coming soon)

### 🎨 Design & UX
- **Dark Luxury Theme** - Dark graphite/black base with neon bio-green accents
- **Cinematic Hero Section** - Eye-catching homepage with animations
- **Smooth Animations** - Glow effects, hover animations, page transitions
- **Mobile-First Design** - Fully responsive across all devices
- **RTL Support** - Proper right-to-left layout for Arabic

### 🌐 Internationalization
- **Bilingual Support** - English and Arabic with instant switching
- **Currency Conversion** - USD ↔ IQD with fixed rate (1 USD = 1400 IQD)
- **Localized Content** - Product names and descriptions in both languages

### 🔐 Authentication & User Management
- **Email/Password Auth** - Secure user registration and login
- **JWT Authentication** - Token-based session management
- **User Profiles** - Account dashboard with order history
- **Role-Based Access** - Admin and user roles

### 👨‍💼 Admin Dashboard
- **Product Management** - Full CRUD operations for products
- **Order Management** - View and update order statuses
- **Inventory Tracking** - Stock level monitoring
- **Statistics Dashboard** - Revenue, orders, and user analytics

### 📱 Social Integration
- **WhatsApp Integration** - Floating button + "Buy via WhatsApp" on products
- **Instagram Link** - Direct link to store's Instagram
- **Contact Forms** - Multiple ways to reach support

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14.2.3** - React framework with App Router
- **React 18** - Latest React features
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - Premium UI components
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB 6.6** - NoSQL database
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing

### Additional Libraries
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **date-fns** - Date manipulation
- **UUID** - Unique ID generation

---

## 📁 Project Structure

```
/app
├── app/
│   ├── api/[[...path]]/route.js    # All API routes
│   ├── page.js                      # Homepage
│   ├── shop/page.js                 # Shop/Products listing
│   ├── product/[id]/page.js         # Product detail page
│   ├── cart/page.js                 # Shopping cart
│   ├── checkout/page.js             # Checkout flow
│   ├── login/page.js                # Authentication
│   ├── account/page.js              # User account
│   ├── admin/page.js                # Admin dashboard
│   ├── categories/page.js           # Category listing
│   ├── about/page.js                # About page
│   ├── contact/page.js              # Contact page
│   ├── faq/page.js                  # FAQ
│   ├── policies/page.js             # Policies
│   ├── order-success/page.js        # Order confirmation
│   ├── layout.js                    # Root layout
│   └── globals.css                  # Global styles
├── components/
│   ├── Navigation.js                # Main navigation
│   ├── Footer.js                    # Footer component
│   ├── WhatsAppButton.js            # WhatsApp floating button
│   └── ui/                          # shadcn components
├── lib/
│   ├── db.js                        # MongoDB connection
│   ├── contexts/
│   │   ├── LanguageContext.js       # i18n management
│   │   ├── CurrencyContext.js       # Currency conversion
│   │   ├── CartContext.js           # Shopping cart state
│   │   └── AuthContext.js           # Authentication state
│   └── utils.js                     # Utility functions
├── scripts/
│   └── seed.js                      # Database seeding
└── .env                             # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or remote)
- Yarn package manager

### Installation

1. **Environment Setup**
   ```bash
   # Already configured in .env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=perfect_sell
   JWT_SECRET=perfect-sell-jwt-secret-key-2025
   NEXTAUTH_SECRET=perfect-sell-nextauth-secret-2025
   ```

2. **Install Dependencies**
   ```bash
   cd /app
   yarn install
   ```

3. **Seed Database**
   ```bash
   node scripts/seed.js
   ```
   This creates:
   - Admin user: `admin@perfectsell.com` / `admin123456`
   - 6 sample products across different categories

4. **Start Development Server**
   ```bash
   yarn dev
   ```
   Server runs on: http://localhost:3000

---

## 🎯 Usage Guide

### For Customers

1. **Browse Products**
   - Visit the shop page
   - Filter by category, search, or sort
   - Click on products for details

2. **Add to Cart**
   - Click "Add to Cart" on product pages
   - Adjust quantities in cart
   - Proceed to checkout

3. **Place Order**
   - Fill in shipping information
   - Review order summary
   - Confirm order (Cash on Delivery)

4. **Track Orders**
   - Login/Register
   - Visit "My Account" → "Order History"
   - View order statuses

### For Admins

1. **Login as Admin**
   - Email: `admin@perfectsell.com`
   - Password: `admin123456`

2. **Access Admin Dashboard**
   - Navigate to `/admin` or click "Admin Dashboard" in user menu

3. **Manage Products**
   - Add new products with images
   - Edit existing products
   - Delete products
   - Track inventory levels

4. **Manage Orders**
   - View all orders
   - Update order statuses (Pending → Processing → Shipped → Delivered)
   - View customer information

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - List user orders (or all for admin)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin only)

### Categories
- `GET /api/categories` - List all categories

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin only)

---

## 🎨 Design System

### Color Palette
- **Primary**: Bio-Green (#22c55e) - Evolution & energy theme
- **Background**: Dark Graphite (hsl(0 0% 8%))
- **Card**: Slightly lighter (hsl(0 0% 10%))
- **Text**: Near white (hsl(0 0% 98%))
- **Muted**: Medium gray (hsl(0 0% 65%))

### Typography
- **Headers**: Bold, gradient text effect
- **Body**: System font stack
- **Monospace**: For order IDs and codes

### Components
- All components use shadcn/ui base
- Custom styling with Tailwind utilities
- Consistent spacing and border radius
- Glow effects on interactive elements

---

## 🌍 Internationalization

### Adding Translations

Edit `/lib/contexts/LanguageContext.js`:

```javascript
export const translations = {
  en: {
    key: 'English text'
  },
  ar: {
    key: 'النص العربي'
  }
};
```

### Using Translations

```javascript
const { t } = useLanguage();
<button>{t('key')}</button>
```

---

## 💳 Payment Integration

### Current
- **Cash on Delivery** - Fully implemented

### Coming Soon
- **Qi Card** - Structure ready for integration
- Add Qi Card API credentials to `.env`
- Implement payment handler in `/api/orders`

---

## 📦 Database Schema

### Users Collection
```javascript
{
  id: UUID,
  email: String,
  password: String (hashed),
  name: String,
  role: String (user/admin),
  createdAt: ISODate
}
```

### Products Collection
```javascript
{
  id: UUID,
  name: String,
  nameAr: String,
  description: String,
  descriptionAr: String,
  price: Number,
  category: String,
  image: String,
  images: [String],
  stock: Number,
  featured: Boolean,
  createdAt: ISODate
}
```

### Orders Collection
```javascript
{
  id: UUID,
  userId: UUID (nullable),
  items: [{
    productId: UUID,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    country: String
  },
  total: Number,
  status: String (pending/processing/shipped/delivered/cancelled),
  paymentMethod: String,
  createdAt: ISODate
}
```

---

## 🔧 Configuration

### Environment Variables

```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=perfect_sell

# Application
NEXT_PUBLIC_BASE_URL=https://nextjs-store-4.preview.emergentagent.com

# Authentication
JWT_SECRET=perfect-sell-jwt-secret-key-2025
NEXTAUTH_SECRET=perfect-sell-nextauth-secret-2025

# OAuth (Optional - Add later)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin
ADMIN_EMAIL=admin@perfectsell.com
ADMIN_PASSWORD=admin123456
```

---

## 🐛 Troubleshooting

### Server Not Starting
```bash
# Restart services
sudo supervisorctl restart nextjs

# Check logs
tail -f /var/log/supervisor/nextjs.out.log
```

### Database Connection Issues
```bash
# Check MongoDB status
sudo supervisorctl status mongodb

# Restart MongoDB
sudo supervisorctl restart mongodb
```

### Clear Cart/Session
```javascript
// In browser console
localStorage.clear()
location.reload()
```

---

## 📈 Future Enhancements

### Phase 1 (Ready to Implement)
- [ ] Google OAuth integration
- [ ] Qi Card payment gateway
- [ ] Email notifications for orders
- [ ] Product reviews and ratings
- [ ] Wishlist functionality

### Phase 2
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Discount codes and coupons
- [ ] Multi-image product gallery
- [ ] Video product demos

### Phase 3
- [ ] Live chat support
- [ ] Inventory alerts
- [ ] Analytics dashboard
- [ ] Newsletter integration
- [ ] SEO optimization

---

## 📞 Contact & Support

- **WhatsApp**: +964 773 379 7713
- **Instagram**: @perfectsell_store
- **Website**: https://nextjs-store-4.preview.emergentagent.com

---

## 📄 License

This project is proprietary software developed for Perfect Sell.

---

## 👨‍💻 Development Notes

### Key Design Decisions
1. **Custom Backend**: Built custom MongoDB backend instead of Shopify for full control
2. **JWT Auth**: Token-based authentication for security and scalability
3. **Context API**: Used React Context for global state management
4. **Next.js App Router**: Leveraged latest Next.js features
5. **shadcn/ui**: Premium component library for consistency

### Performance Optimizations
- Image optimization with Next.js Image component
- Lazy loading of product images
- MongoDB connection pooling
- Client-side caching with Context API
- Minimal external dependencies

### Security Features
- Password hashing with bcryptjs
- JWT token expiration
- Role-based access control
- Input validation
- Protected API routes

---

**Built with 💚 for Perfect Sell - Evolve Your Collection**
