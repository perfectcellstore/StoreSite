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
    price: 'Price',
    name: 'Name',
    category: 'Category',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
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
    price: 'السعر',
    name: 'الاسم',
    category: 'الفئة',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    
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
