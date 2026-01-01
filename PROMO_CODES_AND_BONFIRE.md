# NEW FEATURES ADDED - PROMO CODES & DARK SOULS BONFIRE

## ✅ FEATURES IMPLEMENTED

---

## 1️⃣ PROMO CODES ADDED

### New Promo Codes:

#### **"Ayajonkler"** - 25% Discount
- **Code**: `Ayajonkler` (case-sensitive)
- **Discount**: 25% off
- **Description**: "25% off - Special Code!"
- **Location**: `/app/app/checkout/page.js`

#### **SECRET CODE** - 50% Discount 🔥
- **Code**: `PerfectCellSecret2026` (hidden via Base64 encoding)
- **Discount**: 50% off
- **Description**: "50% off - Secret Unlocked! 🔥"
- **How it's hidden**: The code is stored as Base64 (`atob('UGVyZmVjdENlbGxTZWNyZXQyMDI2')`) so it won't be easily found by users inspecting the code
- **Note**: Only you can share this code with special customers

### All Available Promo Codes:
| Code | Discount | Description | Visibility |
|------|----------|-------------|------------|
| PERFECT10 | 10% | 10% off | Public |
| CELL20 | 20% | 20% off | Public |
| WELCOME | 5% | 5% off for new customers | Public |
| 2026 | 20% | 20% off - New Year Special! | Public |
| Nona1603 | 99% | 99% off - Special Discount! | Public |
| **Ayajonkler** | **25%** | **25% off - Special Code!** | **NEW** |
| **PerfectCellSecret2026** | **50%** | **50% off - Secret Unlocked! 🔥** | **SECRET** |

### How to Use:
1. Go to checkout page
2. Enter promo code in the "Promo Code" field
3. Click "Apply"
4. Discount will be applied to the total

---

## 2️⃣ DARK SOULS BONFIRE EASTER EGG

### Features:
- **Location**: Bottom right corner of mobile menu
- **Design**: Authentic Dark Souls bonfire with sword stuck in coals
- **Animation**: When clicked, the bonfire lights up with realistic flames
- **Message**: Shows "BONFIRE RESTORED" in Dark Souls font styling
- **Effects**: 
  - Flame particles rise from the bonfire
  - Coals glow orange/red when lit
  - Sword blade illuminates with orange glow
  - Animated flickering flames (3 layers)
  - Pulsing orange glow effect
  - Dark Souls-style message box

### Visual Details:
```
Bonfire Components:
├─ Sword (stuck in ground at angle)
│  ├─ Blade (gray → orange when lit)
│  ├─ Crossguard (metallic)
│  ├─ Handle (leather-wrapped)
│  └─ Pommel (round)
├─ Coals/Rocks (3 pieces)
│  └─ Gray → Glowing orange/red when lit
└─ Flames (3 layers when lit)
   ├─ Main central flame
   ├─ Left side flame
   └─ Right side flame
```

### Interaction:
1. **Before Click**: Bonfire is unlit (gray sword, dark coals)
   - Hover shows: "Rest at Bonfire"
2. **On Click**: 
   - Bonfire lights up instantly
   - Flames appear with flickering animation
   - 12 flame particles shoot upward
   - Message appears: "BONFIRE RESTORED"
   - Sword and coals glow orange
3. **After Click**: 
   - Bonfire stays lit permanently
   - Message fades after 3 seconds
   - Only allows one restoration (can't spam)

### Technical Implementation:
- **Component**: `/app/components/DarkSoulsBonfire.js`
- **Integrated in**: `/app/components/Navigation.js` (mobile menu)
- **Styling**: Custom CSS animations for flames
- **Performance**: Optimized with cleanup after animations
- **Responsive**: Works on all mobile screen sizes

### Animations:
- `flame-flicker`: Realistic flame movement (0.6-0.8s cycles)
- `flame-rise`: Particles rising and fading (1.2s)
- `bonfire-message`: Message fade in/out (3s)

---

## 📁 FILES MODIFIED

### Promo Codes:
1. ✅ `/app/app/checkout/page.js`
   - Added "Ayajonkler" code (25% discount)
   - Added secret code via Base64 encoding (50% discount)

### Dark Souls Bonfire:
1. ✅ `/app/components/DarkSoulsBonfire.js` - NEW FILE (296 lines)
   - Complete bonfire component with sword and flames
   - Dark Souls-style animations and effects
   
2. ✅ `/app/components/Navigation.js`
   - Imported DarkSoulsBonfire component
   - Added bonfire to bottom right of mobile menu
   - Positioned with flexbox for perfect placement

---

## 🎮 HOW TO TEST

### Test Promo Codes:
1. **"Ayajonkler" code**:
   ```bash
   - Add items to cart
   - Go to checkout
   - Enter: Ayajonkler
   - Click "Apply"
   - Should show: "25% off - Special Code!"
   ```

2. **Secret code**:
   ```bash
   - Add items to cart
   - Go to checkout
   - Enter: PerfectCellSecret2026
   - Click "Apply"
   - Should show: "50% off - Secret Unlocked! 🔥"
   ```

### Test Dark Souls Bonfire:
1. **On Mobile (or Mobile View)**:
   ```bash
   - Open mobile menu (hamburger icon)
   - Scroll to bottom of menu
   - Look at bottom right corner
   - Should see: Gray bonfire with sword
   - Hover: Shows "Rest at Bonfire" tooltip
   - Click: Bonfire lights up with flames
   - Message: "BONFIRE RESTORED" appears
   - Result: Bonfire stays lit permanently
   ```

2. **Visual Check**:
   ```bash
   Before click:
   ✅ Gray sword stuck in ground
   ✅ Dark coals/rocks
   ✅ No flames
   
   After click:
   ✅ Orange glowing sword
   ✅ Glowing orange coals
   ✅ Animated flickering flames
   ✅ Flame particles rising
   ✅ "BONFIRE RESTORED" message
   ✅ Orange glow effect
   ```

---

## 🔐 SECRET CODE DETAILS

### How the Secret Code is Hidden:

The secret code `PerfectCellSecret2026` is obfuscated using Base64 encoding:

```javascript
// In checkout/page.js:
[atob('UGVyZmVjdENlbGxTZWNyZXQyMDI2')]: { 
  discount: 0.50, 
  description: '50% off - Secret Unlocked! 🔥' 
}
```

**Why this works:**
- Users inspecting the code will see: `atob('UGVyZmVjdENlbGxTZWNyZXQyMDI2')`
- They won't immediately know what the actual promo code is
- They would need to decode the Base64 to find the code
- Most users won't go through this effort

**The Secret Code**: `PerfectCellSecret2026`

**Share this code only with**:
- VIP customers
- Special promotions
- Exclusive offers
- Loyalty rewards

---

## 📊 SUMMARY

### Promo Codes Added:
- ✅ "Ayajonkler" - 25% discount (public)
- ✅ "PerfectCellSecret2026" - 50% discount (secret/hidden)

### Easter Egg Added:
- ✅ Dark Souls bonfire in mobile menu
- ✅ Authentic Dark Souls styling
- ✅ Interactive animation (lights up when clicked)
- ✅ "BONFIRE RESTORED" message
- ✅ Permanent state (stays lit after click)

### Files:
- ✅ 1 file modified (checkout/page.js)
- ✅ 1 new component (DarkSoulsBonfire.js)
- ✅ 1 file modified (Navigation.js)

---

**All features are live and ready to use!** 🎉

The bonfire easter egg is a nice hidden detail for observant users, and the promo codes give you flexible discount options for different customer tiers.
