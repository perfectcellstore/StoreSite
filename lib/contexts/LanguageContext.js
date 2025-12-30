'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    shop: 'Shop',
    categories: 'Categories',
    cart: 'Cart',
    account: 'Account',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    admin: 'Admin Dashboard',
    
    // Hero Section
    heroTitle: 'Perfect Sell',
    heroSubtitle: 'Evolve Your Collection',
    heroDescription: 'Discover epic collectibles, awesome replicas, and legendary gear that bring your favorite characters to life!',
    shopNow: 'Shop Now',
    exploreCollections: 'Explore Collections',
    
    // Categories
    collectibles: 'Collectibles',
    historical: 'Historical Items',
    cosplay: 'Cosplay & Gear',
    weapons: 'Weapon Replicas',
    figures: 'Figures & Statues',
    masks: 'Masks',
    toys: 'Toys',
    rare: 'Rare Items',
    
    // Product
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    buyViaWhatsApp: 'Buy via WhatsApp',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    description: 'Description',
    specifications: 'Specifications',
    reviews: 'Reviews',
    
    // Cart
    yourCart: 'Your Cart',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    proceedToCheckout: 'Proceed to Checkout',
    subtotal: 'Subtotal',
    total: 'Total',
    remove: 'Remove',
    
    // Checkout
    checkout: 'Checkout',
    shippingInformation: 'Shipping Information',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    placeOrder: 'Place Order',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    address: 'Address',
    city: 'City',
    country: 'Country',
    orderSummary: 'Order Summary',
    
    // Account
    myAccount: 'My Account',
    orderHistory: 'Order History',
    profile: 'Profile',
    settings: 'Settings',
    
    // Admin
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    sortBy: 'Sort by',
    price: 'Price',
    name: 'Name',
    category: 'Category',
    allCategories: 'All Categories',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    apply: 'Apply',
    remove: 'Remove',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    quantity: 'Quantity',
    available: 'available',
    deliveryTo: 'Delivery to',
    province: 'Province',
    shipping: 'Shipping',
    discount: 'Discount',
    promoCode: 'Promo Code',
    enterCode: 'Enter code',
    invalidCode: 'Invalid Code',
    codeApplied: 'Promo Code Applied!',
    codeRemoved: 'Promo Code Removed',
    allIraq: 'All Iraq',
    howDoIPlaceOrder: 'How do I place an order?',
    whatPaymentMethods: 'What payment methods do you accept?',
    howLongDelivery: 'How long does delivery take?',
    howMuchShipping: 'How much is shipping?',
    doYouShipInternational: 'Do you ship internationally?',
    areProductsAuthentic: 'Are the products authentic?',
    canICancelOrder: 'Can I cancel or modify my order?',
    whatIsReturnPolicy: 'What is your return policy?',
    howTrackOrder: 'How can I track my order?',
    doYouHavePromoCodes: 'Do you have promo codes?',
    howContactSupport: 'How can I contact customer support?',
    findAnswers: 'Find answers to common questions about Perfect Sell',
    stillHaveQuestions: 'Still have questions? Contact us directly!',
    businessHours: 'Business Hours',
    sendUsMessage: 'Send us a Message',
    yourMessage: 'Your message...',
    sendMessage: 'Send Message',
    welcomeBack: 'Welcome Back',
    signInAccount: 'Sign in to your Perfect Sell account',
    createAccount: 'Create Account',
    testAccount: 'Test Account',
    signingIn: 'Signing in...',
    creatingAccount: 'Creating account...',
    yourOrders: 'Your Orders',
    noOrders: 'You haven\'t placed any orders yet',
    startShopping: 'Start Shopping',
    accountType: 'Account Type',
    memberSince: 'Member Since',
    itemsInOrder: 'Items',
    orderDetails: 'Order Details',
    // Features Section
    authenticQuality: 'Authentic Quality',
    authenticQualityDesc: 'Every item verified for authenticity and premium quality',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Quick and secure delivery to your location',
    rareFinds: 'Rare Finds',
    rareFindsDesc: 'Exclusive and limited edition collectibles',
    
    // Categories Section
    browseCollection: 'Browse our collection by category',
    exploreCuratedCollections: 'Explore our curated collections of rare and premium items',
    viewAllCategories: 'View All Categories',
    
    // CTA Section
    readyToEvolve: 'Ready to Evolve Your Collection?',
    joinThousands: 'Join thousands of collectors who trust Perfect Sell for authentic, rare, and premium items',
    startShopping: 'Start Shopping',
    
    // Menu & Effects
    clickEffects: 'Click Effects',
    on: 'ON',
    off: 'OFF',
    secret: '??? Secret ???',
    
    // Sword Easter Egg
    theLegendarySword: 'The Legendary Sword',
    pullTheSword: 'Pull the Sword! ⚔️',
    pulling: 'Pulling...',
    onlyTheWorthy: 'Only the worthy can pull this blade...',
    youAreWorthy: '⚔️ You Are Worthy! ⚔️',
    legendaryBladeRecognizes: 'The legendary blade recognizes your spirit!',
    ancientPowerFlows: 'The ancient power flows through you. This sacred sword, forged in the fires of evolution, has chosen its champion. With this blade comes great responsibility and even greater rewards.',
    yourLegendaryReward: '🎁 Your Legendary Reward:',
    twentyPercentOff: '20% OFF',
    sacredPromoCode: 'Sacred promo code revealed:',
    copiedToInventory: '✓ Copied to your inventory!',
    useCodeAtCheckout: '⚡ Use this code at checkout to unlock your discount',
    ourStory: 'Our Story',
    ourMission: 'Our Mission',
    whyChooseUs: 'Why Choose Us',
    authenticVerified: 'Authentic and verified products',
    curatedSelection: 'Curated selection of rare items',
    excellentService: 'Excellent customer service',
    codAvailable: 'Cash on delivery available',
    getInTouch: 'Get in Touch',
    policies: 'Policies',
    informationCollection: 'Information Collection',
    howWeUse: 'How We Use Your Information',
    dataSecurity: 'Data Security',
    cookies: 'Cookies',
    thirdParties: 'Third Parties',
    yourRights: 'Your Rights',
    acceptanceOfTerms: 'Acceptance of Terms',
    productInformation: 'Product Information',
    pricing: 'Pricing',
    orderAcceptance: 'Order Acceptance',
    prohibitedUses: 'Prohibited Uses',
    intellectualProperty: 'Intellectual Property',
    limitationOfLiability: 'Limitation of Liability',
    returnPeriod: 'Return Period',
    returnConditions: 'Return Conditions',
    howToReturn: 'How to Return',
    refunds: 'Refunds',
    exchanges: 'Exchanges',
    nonReturnableItems: 'Non-Returnable Items',
    returnShipping: 'Return Shipping',
    noProductsFound: 'No products found',
    onlyLeft: 'Only {count} left',
    deliveryIn: 'Delivery in 1-3 days',
    orderPlacedSuccess: 'Order Placed Successfully!',
    thankYouOrder: 'Thank you for your order. We\'ll process it shortly and contact you via phone for delivery confirmation.',
    orderId: 'Order ID',
    backToHome: 'Back to Home',
    processing: 'Processing...',
    
    // Footer
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    faq: 'FAQ',
    policies: 'Policies',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    returnPolicy: 'Return Policy',
    followUs: 'Follow Us',
    newsletter: 'Newsletter',
    subscribeNewsletter: 'Subscribe to our newsletter',
    subscribe: 'Subscribe',
    
    // Messages
    addedToCart: 'Added to cart successfully',
    orderPlaced: 'Order placed successfully',
    loginSuccess: 'Logged in successfully',
    loginError: 'Login failed',
    registerSuccess: 'Registration successful',
    registerError: 'Registration failed',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    shop: 'المتجر',
    categories: 'الفئات',
    cart: 'السلة',
    account: 'الحساب',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    logout: 'تسجيل الخروج',
    admin: 'لوحة التحكم',
    
    // Hero Section
    heroTitle: 'بيرفكت سيل',
    heroSubtitle: 'طور مجموعتك',
    heroDescription: 'اكتشف المقتنيات النادرة والكنوز التاريخية والمعدات المميزة من جميع أنحاء الكون',
    shopNow: 'تسوق الآن',
    exploreCollections: 'استكشف المجموعات',
    
    // Categories
    collectibles: 'المقتنيات',
    historical: 'القطع التاريخية',
    cosplay: 'الأزياء والمعدات',
    weapons: 'نسخ الأسلحة',
    figures: 'التماثيل والمجسمات',
    masks: 'الأقنعة',
    toys: 'الألعاب',
    rare: 'القطع النادرة',
    
    // Product
    addToCart: 'أضف للسلة',
    buyNow: 'اشتر الآن',
    buyViaWhatsApp: 'اشتر عبر واتساب',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    description: 'الوصف',
    specifications: 'المواصفات',
    reviews: 'التقييمات',
    
    // Cart
    yourCart: 'سلة التسوق',
    emptyCart: 'سلة التسوق فارغة',
    continueShopping: 'متابعة التسوق',
    proceedToCheckout: 'إتمام الطلب',
    subtotal: 'المجموع الفرعي',
    total: 'المجموع الكلي',
    remove: 'إزالة',
    
    // Checkout
    checkout: 'إتمام الطلب',
    shippingInformation: 'معلومات الشحن',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع عند الاستلام',
    placeOrder: 'تأكيد الطلب',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    address: 'العنوان',
    city: 'المدينة',
    country: 'الدولة',
    orderSummary: 'ملخص الطلب',
    
    // Account
    myAccount: 'حسابي',
    orderHistory: 'سجل الطلبات',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    
    // Admin
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    orders: 'الطلبات',
    addProduct: 'إضافة منتج',
    editProduct: 'تعديل منتج',
    deleteProduct: 'حذف منتج',
    
    // Common
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    sortBy: 'ترتيب حسب',
    price: 'السعر',
    name: 'الاسم',
    category: 'الفئة',
    allCategories: 'جميع الفئات',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    apply: 'تطبيق',
    remove: 'إزالة',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    quantity: 'الكمية',
    available: 'متوفر',
    deliveryTo: 'التوصيل إلى',
    province: 'المحافظة',
    shipping: 'الشحن',
    discount: 'الخصم',
    promoCode: 'كود الخصم',
    enterCode: 'أدخل الكود',
    invalidCode: 'كود غير صالح',
    codeApplied: 'تم تطبيق كود الخصم!',
    codeRemoved: 'تمت إزالة كود الخصم',
    allIraq: 'جميع أنحاء العراق',
    howDoIPlaceOrder: 'كيف أقوم بتقديم طلب؟',
    whatPaymentMethods: 'ما هي طرق الدفع المتاحة؟',
    howLongDelivery: 'كم يستغرق التوصيل؟',
    howMuchShipping: 'كم تبلغ تكلفة الشحن؟',
    doYouShipInternational: 'هل تشحنون دولياً؟',
    areProductsAuthentic: 'هل المنتجات أصلية؟',
    canICancelOrder: 'هل يمكنني إلغاء أو تعديل طلبي؟',
    whatIsReturnPolicy: 'ما هي سياسة الإرجاع؟',
    howTrackOrder: 'كيف يمكنني تتبع طلبي؟',
    doYouHavePromoCodes: 'هل لديكم أكواد خصم؟',
    howContactSupport: 'كيف يمكنني التواصل مع الدعم؟',
    findAnswers: 'ابحث عن إجابات للأسئلة الشائعة حول Perfect Sell',
    stillHaveQuestions: 'لا تزال لديك أسئلة؟ تواصل معنا مباشرة!',
    businessHours: 'ساعات العمل',
    sendUsMessage: 'أرسل لنا رسالة',
    yourMessage: 'رسالتك...',
    sendMessage: 'إرسال الرسالة',
    welcomeBack: 'مرحباً بعودتك',
    signInAccount: 'سجل الدخول إلى حسابك في Perfect Sell',
    createAccount: 'إنشاء حساب',
    testAccount: 'حساب تجريبي',
    signingIn: 'جاري تسجيل الدخول...',
    creatingAccount: 'جاري إنشاء الحساب...',
    yourOrders: 'طلباتك',
    noOrders: 'لم تقم بتقديم أي طلبات بعد',
    startShopping: 'ابدأ التسوق',
    accountType: 'نوع الحساب',
    memberSince: 'عضو منذ',
    itemsInOrder: 'المنتجات',
    orderDetails: 'تفاصيل الطلب',
    
    // Features Section
    authenticQuality: 'جودة أصلية',
    authenticQualityDesc: 'كل منتج تم التحقق من أصالته وجودته الممتازة',
    fastDelivery: 'توصيل سريع',
    fastDeliveryDesc: 'توصيل سريع وآمن إلى موقعك',
    rareFinds: 'قطع نادرة',
    rareFindsDesc: 'مقتنيات حصرية ومحدودة الإصدار',
    
    // Categories Section
    browseCollection: 'تصفح مجموعتنا حسب الفئة',
    exploreCuratedCollections: 'استكشف مجموعاتنا المنتقاة من القطع النادرة والمميزة',
    viewAllCategories: 'عرض جميع الفئات',
    
    // CTA Section
    readyToEvolve: 'مستعد لتطوير مجموعتك؟',
    joinThousands: 'انضم إلى آلاف المقتنين الذين يثقون في Perfect Sell للحصول على قطع أصلية ونادرة ومميزة',
    startShopping: 'ابدأ التسوق',
    ourStory: 'قصتنا',
    ourMission: 'مهمتنا',
    whyChooseUs: 'لماذا تختارنا',
    authenticVerified: 'منتجات أصلية ومعتمدة',
    curatedSelection: 'مجموعة منتقاة من القطع النادرة',
    excellentService: 'خدمة عملاء ممتازة',
    codAvailable: 'الدفع عند الاستلام متاح',
    getInTouch: 'تواصل معنا',
    policies: 'السياسات',
    informationCollection: 'جمع المعلومات',
    howWeUse: 'كيف نستخدم معلوماتك',
    dataSecurity: 'أمان البيانات',
    cookies: 'ملفات تعريف الارتباط',
    thirdParties: 'أطراف ثالثة',
    yourRights: 'حقوقك',
    acceptanceOfTerms: 'قبول الشروط',
    productInformation: 'معلومات المنتج',
    pricing: 'التسعير',
    orderAcceptance: 'قبول الطلب',
    prohibitedUses: 'الاستخدامات المحظورة',
    intellectualProperty: 'الملكية الفكرية',
    limitationOfLiability: 'حدود المسؤولية',
    returnPeriod: 'فترة الإرجاع',
    returnConditions: 'شروط الإرجاع',
    howToReturn: 'كيفية الإرجاع',
    refunds: 'المبالغ المستردة',
    exchanges: 'الاستبدال',
    nonReturnableItems: 'منتجات لا يمكن إرجاعها',
    returnShipping: 'شحن الإرجاع',
    noProductsFound: 'لم يتم العثور على منتجات',
    onlyLeft: 'متبقي {count} فقط',
    deliveryIn: 'التوصيل خلال 1-3 أيام',
    orderPlacedSuccess: 'تم تقديم الطلب بنجاح!',
    thankYouOrder: 'شكراً لطلبك. سنقوم بمعالجته قريباً والتواصل معك عبر الهاتف لتأكيد التوصيل.',
    orderId: 'رقم الطلب',
    backToHome: 'العودة للرئيسية',
    processing: 'جاري المعالجة...',
    
    // Footer
    aboutUs: 'من نحن',
    contactUs: 'اتصل بنا',
    faq: 'الأسئلة الشائعة',
    policies: 'السياسات',
    termsOfService: 'شروط الخدمة',
    privacyPolicy: 'سياسة الخصوصية',
    returnPolicy: 'سياسة الإرجاع',
    followUs: 'تابعنا',
    newsletter: 'النشرة البريدية',
    subscribeNewsletter: 'اشترك في نشرتنا البريدية',
    subscribe: 'اشترك',
    
    // Messages
    addedToCart: 'تمت الإضافة للسلة بنجاح',
    orderPlaced: 'تم تقديم الطلب بنجاح',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    loginError: 'فشل تسجيل الدخول',
    registerSuccess: 'تم التسجيل بنجاح',
    registerError: 'فشل التسجيل',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    setDirection(savedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    setDirection(newLang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
