'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('price-asc');
  
  // Get category from URL, default to 'all'
  const urlCategory = searchParams.get('category');
  const [category, setCategory] = useState(urlCategory || 'all');
  
  // Update category when URL changes (e.g., navigating from collection card)
  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

  // Fetch collections for the category filter
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections');
        const data = await response.json();
        if (data.collections) {
          setCollections(data.collections);
        }
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };
    
    fetchCollections();
  }, []);

  // Build categories list from collections
  const categories = [
    { id: 'all', name: 'All Categories', nameAr: 'جميع الفئات' },
    ...collections.map(col => ({
      id: col.name,
      name: col.name,
      nameAr: col.nameAr
    }))
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
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                priority={index < 4} // Prioritize first 4 images
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
