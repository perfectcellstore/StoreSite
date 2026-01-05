'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import { useCart } from '@/lib/contexts/CartContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, MessageCircle, Check } from 'lucide-react';
import { ProductReviews } from '@/components/ProductReviews';
import { ProductGallery } from '@/components/ProductGallery';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState([]); // For variant selection

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewUpdate = () => {
    // Refresh product data when reviews are updated
    fetchProduct();
  };

  // Toggle variant selection
  const toggleVariant = (index) => {
    if (selectedVariants.includes(index)) {
      setSelectedVariants(selectedVariants.filter(i => i !== index));
    } else {
      setSelectedVariants([...selectedVariants, index]);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // If product has variants and some are selected, include variant info
      if (product.hasVariants && selectedVariants.length > 0) {
        const variantInfo = selectedVariants.map(idx => {
          const label = product.variantLabels?.[idx] || `Option ${idx + 1}`;
          return label;
        }).join(', ');
        addToCart({ ...product, selectedVariant: variantInfo }, quantity);
      } else {
        addToCart(product, quantity);
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (product.hasVariants && selectedVariants.length > 0) {
        const variantInfo = selectedVariants.map(idx => {
          const label = product.variantLabels?.[idx] || `Option ${idx + 1}`;
          return label;
        }).join(', ');
        addToCart({ ...product, selectedVariant: variantInfo }, quantity);
      } else {
        addToCart(product, quantity);
      }
      router.push('/cart');
    }
  };

  const handleWhatsAppBuy = () => {
    if (product) {
      const productName = language === 'ar' && product.nameAr ? product.nameAr : product.name;
      let message = `Hi! I'm interested in: ${productName} (${formatPrice(product.price)})`;
      if (product.hasVariants && selectedVariants.length > 0) {
        const variantInfo = selectedVariants.map(idx => product.variantLabels?.[idx] || `Option ${idx + 1}`).join(', ');
        message += ` - Selected: ${variantInfo}`;
      }
      const whatsappUrl = `https://wa.me/9647733797713?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin h-12 w-12 border-4 border-bio-green-500 border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => router.push('/shop')}>Back to Shop</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const productName = language === 'ar' && product.nameAr ? product.nameAr : product.name;
  const productDescription = language === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
  
  // Combine main image with additional images array
  const images = [
    product.image,
    ...(product.images || [])
  ].filter(img => img && img.trim() !== ''); // Filter out empty strings

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Gallery */}
          <div>
            <ProductGallery 
              images={images} 
              productName={productName} 
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{productName}</h1>
              
              {/* Coming Soon Badge */}
              {product.comingSoon ? (
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-500/50">
                    <span className="text-2xl">🚀</span>
                    <span className="text-lg font-bold text-amber-500">Coming Soon</span>
                  </div>
                  <p className="text-2xl font-bold text-muted-foreground">Price TBD</p>
                </div>
              ) : (
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <p className="text-4xl font-bold text-bio-green-500">{formatPrice(product.price)}</p>
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-bio-green-500/10 rounded-full">
                      <Check className="h-4 w-4 text-bio-green-500" />
                      <span className="text-sm text-bio-green-500">{t('inStock')}</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-destructive/10 rounded-full">
                      <span className="text-sm text-destructive">{t('outOfStock')}</span>
                    </div>
                  )}
                  {(product.reviewCount || 0) > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-card/80 rounded-full border border-border/40">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(product.averageRating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {(product.averageRating || 0).toFixed(1)} ({product.reviewCount || 0})
                    </span>
                  </div>
                )}
                </div>
              )}
            </div>

            {/* Quantity - Only show if not Coming Soon and has stock */}
            {!product.comingSoon && product.stock > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-border hover:border-bio-green-500"
                  >
                    -
                  </Button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="border-border hover:border-bio-green-500"
                  >
                    +
                  </Button>
                  <span className="text-sm text-muted-foreground">({product.stock} available)</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {product.comingSoon ? (
                <>
                  <Button
                    disabled
                    className="w-full bg-amber-500/20 text-amber-500 border border-amber-500/50 text-lg py-6 cursor-not-allowed"
                  >
                    🔔 Coming Soon - Stay Tuned!
                  </Button>
                  <Button
                    onClick={handleWhatsAppBuy}
                    variant="outline"
                    className="w-full border-border hover:border-bio-green-500 hover:bg-bio-green-500/10 text-lg py-6"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Ask About This Product
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-bio-green-500 hover:bg-bio-green-600 text-white text-lg py-6 btn-glow"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {t('addToCart')}
                  </Button>
                  
                  <Button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    variant="outline"
                    className="w-full border-bio-green-500 text-bio-green-500 hover:bg-bio-green-500 hover:text-white text-lg py-6"
                  >
                    {t('buyNow')}
                  </Button>
                  
                  <Button
                    onClick={handleWhatsAppBuy}
                    variant="outline"
                    className="w-full border-border hover:border-bio-green-500 hover:bg-bio-green-500/10 text-lg py-6"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t('buyViaWhatsApp')}
                  </Button>
                </>
              )}
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="description">{t('description')}</TabsTrigger>
                <TabsTrigger value="specifications">{t('specifications')}</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="space-y-4 pt-4">
                <p className="text-muted-foreground leading-relaxed">{productDescription}</p>
              </TabsContent>
              <TabsContent value="specifications" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Stock</span>
                    <span className="font-medium">{product.stock} units</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Product ID</span>
                    <span className="font-medium text-xs">{product.id}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <ProductReviews productId={product.id} onReviewUpdate={handleReviewUpdate} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
