# Perfect Cell Store - Database Setup

## Environment Setup

The `.env` file contains all necessary environment variables for the application:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=perfect_cell_store
JWT_SECRET=perfect-sell-jwt-secret-2024
NEXT_PUBLIC_BASE_URL=https://app.inferable.ai
```

## Database Seeding

To populate the database with sample data (products, collections, and admin user):

```bash
cd /app
node scripts/seed.js
```

This will:
- ✅ Clear existing products and collections
- ✅ Create 4 sample collections (Rare Collectibles, Action Figures, Cosplay Gear, Weapon Replicas)
- ✅ Create 8 sample products with full details
- ✅ Ensure admin user exists

## Admin Login

After seeding, you can log in to the admin dashboard:

- **URL**: `/admin`
- **Email**: `perfectcellstore@gmail.com`
- **Password**: `DragonBall123!`

## Sample Data Included

### Collections (4):
1. 💎 Rare Collectibles - Exclusive and rare items for true collectors
2. 🦸 Action Figures - Premium action figures and statues
3. 🎭 Cosplay Gear - Professional cosplay costumes and accessories
4. ⚔️ Weapon Replicas - High-quality weapon replicas from your favorite series

### Products (8):
1. **Super Saiyan Goku Figure** - $149.99 (25% OFF) - Featured
2. **Perfect Cell Helmet** - $299.99 (25% OFF) - Featured
3. **Excalibur Sword Replica** - $399.99 - Featured
4. **Naruto Headband Set** - $79.99 (20% OFF)
5. **Vegeta Elite Armor** - $249.99 (29% OFF) - Featured
6. **One Piece Straw Hat** - $49.99
7. **Master Sword (Legend of Zelda)** - $349.99 (22% OFF) - Featured
8. **Rare Manga Collection Box Set** - $599.99

All products include:
- ✅ English and Arabic names/descriptions
- ✅ High-quality images
- ✅ Stock quantities
- ✅ Discount labels (where applicable)
- ✅ Featured flags
- ✅ SEO tags

## Troubleshooting

### Database Connection Issues

If you get "Failed to connect to MongoDB" errors:

1. Check if MongoDB is running:
```bash
sudo supervisorctl status mongodb
```

2. Restart MongoDB if needed:
```bash
sudo supervisorctl restart mongodb
```

3. Verify .env file exists:
```bash
cat /app/.env
```

### Restart Application

If changes aren't reflected, restart the Next.js server:

```bash
sudo supervisorctl restart nextjs
```

Or restart all services:

```bash
sudo supervisorctl restart all
```

## API Endpoints

- `GET /api/products` - List all products
- `GET /api/collections` - List all collections
- `GET /api/health` - Check database health
- `POST /api/auth/login` - Admin login
- `GET /api/admin/stats` - Admin statistics (requires auth)

## Development

The application uses:
- **Next.js 14** - Frontend and API routes
- **MongoDB** - Database
- **JWT** - Authentication
- **Tailwind CSS** - Styling
- **Shadcn/UI** - UI components
