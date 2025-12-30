# Perfect Sell - Admin Guide

## 🎯 Accessing the Admin Dashboard

### Admin Credentials
- **Email:** `perfectcellstore@gmail.com`
- **Password:** `adminpassword`

### Login Steps
1. Go to your website homepage
2. Click the **"Login"** button in the top right corner
3. Enter your admin credentials
4. After logging in, click on your profile icon → **"Admin"** to access the dashboard

---

## 📦 Managing Products

### Adding a New Product

1. **Navigate to Admin Dashboard**
   - Click on the **"Products"** tab (default view)

2. **Click "Add Product" Button**
   - Located at the top right of the Products section

3. **Fill in Product Details:**

   **English Information:**
   - **Product Name (English):** e.g., "Dragon Ball Z Goku Figure"
   - **Description (English):** Full description of the product
   
   **Arabic Information (Optional but Recommended):**
   - **Product Name (Arabic):** e.g., "تمثال غوكو دراغون بول"
   - **Description (Arabic):** Arabic description for bilingual support

   **Pricing & Inventory:**
   - **Price (USD):** Enter price in USD (e.g., 49.99)
   - **Stock:** Number of items available (e.g., 25)
   - **Category:** Select from dropdown:
     - Collectibles (المقتنيات)
     - Historical Items (القطع التاريخية)
     - Cosplay & Gear (الأزياء والمعدات)
     - Weapon Replicas (نسخ الأسلحة)
     - Figures & Statues (التماثيل والمجسمات)
     - Masks (الأقنعة)
     - Toys (الألعاب)
     - Rare (النادر)

4. **Upload Product Image:**
   
   **Option 1: Upload from Computer**
   - Click on the upload area
   - Select an image file from your computer
   - Supported formats: PNG, JPG, GIF
   - Maximum size: 5MB
   - The image will upload automatically with progress indicator
   
   **Option 2: Use Image URL**
   - If you have an image hosted elsewhere, paste the URL in the text field below the upload area
   - Example: `https://example.com/product-image.jpg`

5. **Save the Product**
   - Click **"Create Product"** button
   - You'll see a success message
   - The product will appear in your products list

---

### Editing a Product

1. Find the product in your Products list
2. Click the **"Edit" icon** (pencil button) on the right side
3. Modify any field you want to change
4. Upload a new image if needed (the old one will be replaced)
5. Click **"Update Product"** to save changes

---

### Deleting a Product

1. Find the product in your Products list
2. Click the **"Delete" icon** (trash button) on the right side
3. Confirm the deletion in the popup dialog
4. The product will be removed immediately

---

## 📋 Managing Orders

### Viewing Orders

1. Navigate to Admin Dashboard
2. Click on the **"Orders"** tab
3. You'll see all customer orders with:
   - Order ID
   - Customer name and email
   - Order total
   - Order items
   - Shipping address
   - Current status

### Updating Order Status

Each order has a status dropdown with these options:
- **Pending:** Order just received (default)
- **Processing:** You're preparing the order
- **Shipped:** Order has been sent to customer
- **Delivered:** Customer received the order
- **Cancelled:** Order was cancelled

**To update:**
1. Find the order you want to update
2. Click on the status dropdown on the right side
3. Select the new status
4. The change is saved automatically
5. Customer will see the updated status

---

## 📊 Dashboard Statistics

At the top of the admin dashboard, you'll see 4 key metrics:

1. **Total Products:** Number of products in your store
2. **Total Orders:** Number of orders received
3. **Total Users:** Number of registered users
4. **Total Revenue:** Combined value of all orders (in your selected currency)

These stats update automatically when you make changes.

---

## 💡 Best Practices

### Product Images
- Use high-quality, clear product photos
- Recommended size: at least 800x800 pixels
- Use consistent backgrounds (white or transparent recommended)
- Show multiple angles if possible using image editing software before upload

### Product Descriptions
- Be detailed and accurate
- Include dimensions, materials, and features
- Mention any special care instructions
- Highlight what makes the product unique

### Inventory Management
- Keep stock numbers accurate
- Set stock to 0 when out of stock (product will show as unavailable)
- Update stock after fulfilling orders

### Order Processing
- Check orders daily
- Update order status promptly to keep customers informed
- Move to "Processing" when you start preparing
- Mark as "Shipped" once sent with tracking info
- Complete as "Delivered" when confirmed

---

## 🔧 Technical Notes

### Image Storage
- Uploaded images are stored in `/public/uploads/` folder
- Images are automatically renamed with timestamp to avoid conflicts
- Maximum file size: 5MB per image
- Supported formats: PNG, JPG, GIF, WEBP

### Price Display
- Prices entered in USD
- System automatically converts to IQD at 1 USD = 1400 IQD
- Currency toggle available for customers in navigation

### Bilingual Support
- Always fill in both English and Arabic fields for best customer experience
- Arabic translations help reach wider audience
- If Arabic is skipped, English text will be shown to Arabic users

---

## 🆘 Troubleshooting

### Image Upload Failed
- Check file size (must be under 5MB)
- Ensure file is an image format (PNG, JPG, GIF)
- Try refreshing the page and uploading again
- If issue persists, use the URL field with an externally hosted image

### Can't Access Admin Dashboard
- Verify you're logged in with admin account
- Check that you're using the correct admin email and password
- Clear browser cookies and try again

### Changes Not Showing
- Refresh the page after making changes
- Clear browser cache
- Check if you clicked "Save" or "Update" button

---

## 📞 Need Help?

If you encounter any issues or need assistance:
- Take a screenshot of the problem
- Note any error messages you see
- Document the steps you took before the issue occurred

---

## 🚀 Quick Start Checklist

- [ ] Log in with admin credentials
- [ ] Add your first product with image
- [ ] Test the product appears on shop page
- [ ] Create a test order (optional)
- [ ] Practice updating order status
- [ ] Familiarize yourself with dashboard stats

**You're now ready to manage your Perfect Sell store! 🎉**
