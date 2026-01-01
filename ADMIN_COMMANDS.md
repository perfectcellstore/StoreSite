# 🎮 Perfect Sell - Admin Commands & Guide

## 🔐 Admin Access

### Admin Credentials
- **Email**: perfectcellstore@gmail.com
- **Password**: admin123456
- **Admin Dashboard**: https://nextjs-store-4.preview.emergentagent.com/admin

---

## 💻 Server Management Commands

### Restart Services
```bash
# Restart Next.js application
sudo supervisorctl restart nextjs

# Restart all services
sudo supervisorctl restart all

# Check service status
sudo supervisorctl status
```

### Check Logs
```bash
# View Next.js logs
tail -f /var/log/supervisor/nextjs.out.log

# View last 100 lines
tail -n 100 /var/log/supervisor/nextjs.out.log
```

---

## 🗄️ Database Management Commands

### MongoDB Access
```bash
# Access MongoDB shell
mongosh perfect_sell

# Or with full connection
mongosh mongodb://localhost:27017/perfect_sell
```

### Common MongoDB Commands

#### View All Collections
```javascript
show collections
```

#### View All Products
```javascript
db.products.find().pretty()
```

#### View All Orders
```javascript
db.orders.find().pretty()
```

#### View All Users
```javascript
db.users.find().pretty()
```

#### Count Documents
```javascript
db.products.countDocuments()
db.orders.countDocuments()
db.users.countDocuments()
```

#### Find Specific Product
```javascript
db.products.findOne({name: "Premium Collectible Figure"})
```

#### Update Product Stock
```javascript
db.products.updateOne(
  {name: "Premium Collectible Figure"},
  {$set: {stock: 20}}
)
```

#### Delete Product
```javascript
db.products.deleteOne({name: "Product Name"})
```

#### View Orders by Status
```javascript
db.orders.find({status: "pending"}).pretty()
```

#### Update Order Status
```javascript
db.orders.updateOne(
  {id: "order-id-here"},
  {$set: {status: "shipped"}}
)
```

---

## 🎯 Promo Codes Management

### Active Promo Codes
Located in: `/app/app/checkout/page.js`

Current codes:
- **PERFECT10**: 10% off
- **CELL20**: 20% off  
- **WELCOME**: 5% off for new customers

### Add New Promo Code
Edit the `PROMO_CODES` object in `/app/app/checkout/page.js`:

```javascript
const PROMO_CODES = {
  'YOUR_CODE': { discount: 0.15, description: '15% off' },
  // ... existing codes
};
```

---

## 📦 Product Management

### Via Admin Dashboard (Easiest)
1. Login to admin dashboard
2. Go to "Products" tab
3. Click "Add Product"
4. Fill in all details (English & Arabic)
5. Add product image URL
6. Set price (in USD) and stock
7. Click "Create Product"

### Via MongoDB (Advanced)
```javascript
db.products.insertOne({
  id: "uuid-here",
  name: "Product Name",
  nameAr: "اسم المنتج",
  description: "Product description",
  descriptionAr: "وصف المنتج",
  price: 99.99,
  category: "collectibles",
  image: "https://example.com/image.jpg",
  images: ["https://example.com/image1.jpg"],
  stock: 10,
  featured: true,
  createdAt: new Date().toISOString()
})
```

---

## 📊 Analytics & Stats

### View Store Statistics
```javascript
// Total revenue
db.orders.aggregate([
  {$group: {_id: null, totalRevenue: {$sum: "$total"}}}
])

// Orders by status
db.orders.aggregate([
  {$group: {_id: "$status", count: {$sum: 1}}}
])

// Top selling products
db.orders.aggregate([
  {$unwind: "$items"},
  {$group: {_id: "$items.productId", totalSold: {$sum: "$items.quantity"}}},
  {$sort: {totalSold: -1}},
  {$limit: 10}
])

// Orders this month
db.orders.countDocuments({
  createdAt: {
    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  }
})
```

---

## 🛠️ Maintenance Commands

### Backup Database
```bash
mongodump --db=perfect_sell --out=/backup/$(date +%Y%m%d)
```

### Restore Database
```bash
mongorestore --db=perfect_sell /backup/20250101/perfect_sell
```

### Clear All Orders (Caution!)
```javascript
db.orders.deleteMany({})
```

### Reset Product Stock
```javascript
db.products.updateMany({}, {$set: {stock: 10}})
```

---

## 🎨 Customization

### Update Shipping Cost
Edit `/app/app/checkout/page.js`:
```javascript
const SHIPPING_COST_IQD = 5000; // Change this value
```

### Update Store Colors
Edit `/app/app/globals.css` or `/app/tailwind.config.js`

### Update Translations
Edit `/app/lib/contexts/LanguageContext.js`

---

## 🚀 Deployment Commands

### Build for Production
```bash
cd /app
yarn build
```

### Start Production Server
```bash
yarn start
```

### Environment Variables
Located in `/app/.env`:
- MONGO_URL
- DB_NAME
- JWT_SECRET
- ADMIN_EMAIL
- STORE_EMAIL

---

## 🔧 Troubleshooting

### Server Not Responding
```bash
sudo supervisorctl restart nextjs
```

### Database Connection Issues
```bash
sudo supervisorctl restart mongodb
sudo supervisorctl status mongodb
```

### Clear Node Modules & Reinstall
```bash
cd /app
rm -rf node_modules
yarn install
```

### Check Running Processes
```bash
ps aux | grep next
ps aux | grep mongo
```

---

## 📞 Admin Support Contacts

- **Store Email**: perfectcellstore@gmail.com
- **WhatsApp**: +964 773 379 7713
- **Instagram**: @perfectsell_store

---

## 🎯 Quick Admin Tasks

### Add New Admin User
```javascript
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

db.users.insertOne({
  id: uuidv4(),
  email: "newadmin@example.com",
  password: bcrypt.hashSync("password123", 10),
  name: "New Admin",
  role: "admin",
  createdAt: new Date().toISOString()
})
```

### Change Admin Password
```javascript
const bcrypt = require('bcryptjs');

db.users.updateOne(
  {email: "perfectcellstore@gmail.com"},
  {$set: {password: bcrypt.hashSync("newpassword", 10)}}
)
```

### Feature a Product
```javascript
db.products.updateOne(
  {id: "product-id"},
  {$set: {featured: true}}
)
```

### Bulk Update Category
```javascript
db.products.updateMany(
  {category: "oldcategory"},
  {$set: {category: "newcategory"}}
)
```

---

## 📝 Notes

- Always backup database before major changes
- Test changes on a few products before bulk updates
- Monitor logs after making changes
- Keep admin credentials secure
- Regular backups recommended weekly

---

**Last Updated**: December 30, 2024
**Version**: 1.0.0
