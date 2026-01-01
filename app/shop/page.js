'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import { useCart } from '@/lib/contexts/CartContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Search } from 'lucide-react';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('price-asc');

  const categories = [
    { id: 'all', name: 'All Categories', nameAr: 'جميع الفئات' },
    { id: 'collectibles', name: 'Collectibles', nameAr: 'المقتنيات' },
    { id: 'historical', name: 'Historical Items', nameAr: 'القطع التاريخية' },
    { id: 'cosplay', name: 'Cosplay & Gear', nameAr: 'الأزياء والمعدات' },
    { id: 'weapons', name: 'Weapon Replicas', nameAr: 'نسخ الأسلحة' },
    { id: 'figures', name: 'Figures & Statues', nameAr: 'التماثيل والمجسمات' },
    { id: 'masks', name: 'Masks', nameAr: 'الأقنعة' },
    { id: 'toys', name: 'Toys', nameAr: 'الألعاب' },
    { id: 'rare', name: 'Rare Items', nameAr: 'القطع النادرة' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, search, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('shop')}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore our premium collection of rare and authentic items
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border focus:border-bio-green-500"
            />
          </div>

          {/* Category */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-card border-border focus:border-bio-green-500">
              <SelectValue placeholder={t('category')} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {language === 'ar' ? cat.nameAr : cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="bg-card border-border focus:border-bio-green-500">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="price-asc">{t('priceLowToHigh')}</SelectItem>
              <SelectItem value="price-desc">{t('priceHighToLow')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-bio-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover overflow-hidden">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={language === 'ar' && product.nameAr ? product.nameAr : product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    {/* Discount Badge */}
                    {product.onSale && product.discountPercentage && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="bg-destructive text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg animate-pulse">
                          {product.discountPercentage}% OFF
                        </div>
                        {product.dealLabel && (
                          <div className="bg-bio-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg mt-1 shadow-lg">
                            {product.dealLabel}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Stock Badge */}
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-bio-green-500 text-white text-xs rounded shadow-lg">
                        Only {product.stock} left
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-destructive text-white text-xs rounded shadow-lg">
                        {t('outOfStock')}
                      </div>
                    )}
                  </div>
                </Link>
                
                <CardContent className="p-4 space-y-3">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg group-hover:text-bio-green-500 transition-colors line-clamp-2">
                      {language === 'ar' && product.nameAr ? product.nameAr : product.name}
                    </h3>
                  </Link>
                  
                  {/* Price with discount */}
                  <div className="flex items-center gap-2">
                    {product.onSale && product.originalPrice ? (
                      <>
                        <p className="text-2xl font-bold text-bio-green-500">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-bio-green-500">
                        {formatPrice(product.price)}
                      </p>
                    )}
                  </div>
                  
                  {product.onSale && (
                    <p className="text-xs text-destructive font-semibold">
                      Save {formatPrice(product.originalPrice - product.price)}!
                    </p>
                  )}
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-bio-green-500 hover:bg-bio-green-600 text-white btn-glow"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {t('addToCart')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
