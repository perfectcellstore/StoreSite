'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { Package, ShoppingBag, Users, DollarSign, Plus, Edit, Trash2, Eye, Palette } from 'lucide-react';
import { StoreCustomization } from '@/components/StoreCustomization';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    image: '',
    icon: '📦',
    showOnHome: true
  });
  
  const [productForm, setProductForm] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    originalPrice: '', // For discount feature
    category: 'collectibles',
    image: '',
    stock: '',
    onSale: false, // Whether product is on sale
    dealLabel: '', // Optional: "Limited Time", "Hot Deal", etc.
    featured: false, // Featured on homepage
    tags: '' // Comma-separated tags for SEO
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login?redirect=/admin');
      } else {
        fetchData();
      }
    }
  }, [user, authLoading]);

  // Debounced order search to avoid spamming API
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const t = setTimeout(() => {
      fetchData({ searchOverride: orderSearch });
    }, 300);

    return () => clearTimeout(t);
  }, [orderSearch]);

  const fetchData = async (opts = {}) => {
    const { searchOverride } = opts;

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const searchValue = typeof searchOverride === 'string' ? searchOverride : orderSearch;

      const [statsRes, productsRes, ordersRes, collectionsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/products'),
        fetch(`/api/orders?search=${encodeURIComponent(searchValue || '')}`, { headers }),
        fetch('/api/collections')
      ]);

      const statsData = await statsRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const collectionsData = await collectionsRes.json();

      setStats(statsData.stats);
      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
      setCollections(collectionsData.collections || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      // Calculate discount percentage if both prices are provided
      const finalPrice = parseFloat(productForm.price);
      const originalPrice = productForm.originalPrice ? parseFloat(productForm.originalPrice) : null;
      
      // If originalPrice is provided and greater than price, mark as on sale
      const isOnSale = originalPrice && originalPrice > finalPrice;
      const discountPercentage = isOnSale 
        ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
        : 0;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productForm,
          price: finalPrice,
          originalPrice: originalPrice || null,
          stock: parseInt(productForm.stock),
          onSale: isOnSale,
          discountPercentage: discountPercentage
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Product ${editingProduct ? 'updated' : 'created'} successfully${isOnSale ? ` with ${discountPercentage}% discount` : ''}`
        });
        setShowProductDialog(false);
        setEditingProduct(null);
        resetProductForm();
        fetchData();
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Product deleted successfully'
        });
        fetchData();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Collection Management Functions
  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingCollection ? `/api/collections/${editingCollection.id}` : '/api/collections';
      const method = editingCollection ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(collectionForm)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Collection ${editingCollection ? 'updated' : 'created'} successfully`
        });
        setShowCollectionDialog(false);
        setEditingCollection(null);
        resetCollectionForm();
        fetchData();
      } else {
        throw new Error('Failed to save collection');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const resetCollectionForm = () => {
    setCollectionForm({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      image: '',
      icon: '📦',
      showOnHome: true
    });
  };

  const handleEditCollection = (collection) => {
    setEditingCollection(collection);
    setCollectionForm({
      name: collection.name,
      nameAr: collection.nameAr || '',
      description: collection.description || '',
      descriptionAr: collection.descriptionAr || '',
      image: collection.image || '',
      icon: collection.icon || '📦',
      showOnHome: collection.showOnHome !== false
    });
    setShowCollectionDialog(true);
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Collection deleted successfully'
        });
        fetchData();
      } else {
        throw new Error('Failed to delete collection');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Order status updated'
        });
        fetchData();
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      price: '',
      originalPrice: '',
      category: 'collectibles',
      image: '',
      stock: '',
      onSale: false,
      dealLabel: '',
      featured: false,
      tags: ''
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      nameAr: product.nameAr || '',
      description: product.description,
      descriptionAr: product.descriptionAr || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
      onSale: product.onSale || false,
      dealLabel: product.dealLabel || '',
      featured: product.featured || false,
      tags: product.tags || ''
    });
    setShowProductDialog(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-bio-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Admin Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Manage your Perfect Sell store</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <Package className="h-4 w-4 text-bio-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.productsCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-bio-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.ordersCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-bio-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.usersCount || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-bio-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bio-green-500">{formatPrice(stats?.totalRevenue || 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="collections">
              <Package className="h-4 w-4 mr-2" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customization">
              <Palette className="h-4 w-4 mr-2" />
              Store Customization
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products</h2>
              <Dialog open={showProductDialog} onOpenChange={(open) => {
                setShowProductDialog(open);
                if (!open) {
                  setEditingProduct(null);
                  resetProductForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-bio-green-500 hover:bg-bio-green-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Product Name (English)</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label>Product Name (Arabic)</Label>
                        <Input
                          value={productForm.nameAr}
                          onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description (English)</Label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        required
                        className="bg-background border-border"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Description (Arabic)</Label>
                      <Textarea
                        value={productForm.descriptionAr}
                        onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })}
                        className="bg-background border-border"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Sale Price (USD) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                          className="bg-background border-border"
                          placeholder="399.99"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Current selling price
                        </p>
                      </div>
                      <div>
                        <Label>Original Price (USD)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          className="bg-background border-border"
                          placeholder="799.99"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Before discount (optional)
                        </p>
                      </div>
                      <div>
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    {/* Discount Preview */}
                    {productForm.price && productForm.originalPrice && parseFloat(productForm.originalPrice) > parseFloat(productForm.price) && (
                      <div className="bg-bio-green-500/10 border border-bio-green-500/30 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-bio-green-500">
                              💰 Deal Active: {Math.round(((parseFloat(productForm.originalPrice) - parseFloat(productForm.price)) / parseFloat(productForm.originalPrice)) * 100)}% OFF
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Save ${(parseFloat(productForm.originalPrice) - parseFloat(productForm.price)).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground line-through">${parseFloat(productForm.originalPrice).toFixed(2)}</p>
                            <p className="text-lg font-bold text-bio-green-500">${parseFloat(productForm.price).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Deal Label */}
                    <div>
                      <Label>Deal Label (Optional)</Label>
                      <Input
                        value={productForm.dealLabel}
                        onChange={(e) => setProductForm({ ...productForm, dealLabel: e.target.value })}
                        className="bg-background border-border"
                        placeholder="Limited Time • Hot Deal • Flash Sale"
                        maxLength={30}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Displays on product card when on sale (e.g., &quot;Limited Time&quot;, &quot;Hot Deal&quot;)
                      </p>
                    </div>

                    {/* Featured & Tags Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 border border-border rounded-lg p-4 bg-background/50">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                          className="w-4 h-4 text-bio-green-500 border-gray-300 rounded focus:ring-bio-green-500"
                        />
                        <div className="flex-1">
                          <Label htmlFor="featured" className="cursor-pointer font-semibold">
                            ⭐ Featured Product
                          </Label>
                          <p className="text-xs text-muted-foreground">Show on homepage carousel</p>
                        </div>
                      </div>
                      <div>
                        <Label>Tags (Optional)</Label>
                        <Input
                          value={productForm.tags}
                          onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                          className="bg-background border-border"
                          placeholder="collectible, limited, exclusive"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Comma-separated (for search & SEO)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {collections.map((collection) => (
                              <SelectItem key={collection.id} value={collection.name}>
                                {collection.icon} {collection.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Product Image</Label>
                      <ImageUpload
                        value={productForm.image}
                        onChange={(url) => setProductForm({ ...productForm, image: url })}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload an image or enter a URL manually below
                      </p>
                      <Input
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="bg-background border-border mt-2"
                        placeholder="Or paste image URL here"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1 bg-bio-green-500 hover:bg-bio-green-600 text-white">
                        {editingProduct ? 'Update Product' : 'Create Product'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowProductDialog(false);
                          setEditingProduct(null);
                          resetProductForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="bg-card/50 border-border/40">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 relative flex-shrink-0 rounded overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        <div className="flex flex-wrap gap-3 mt-2 items-center">
                          {product.onSale && product.originalPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground line-through text-sm">{formatPrice(product.originalPrice)}</span>
                              <span className="text-bio-green-500 font-bold text-lg">{formatPrice(product.price)}</span>
                              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                                {product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </span>
                              {product.dealLabel && (
                                <span className="bg-bio-green-500/20 text-bio-green-500 text-xs font-semibold px-2 py-1 rounded border border-bio-green-500/30">
                                  {product.dealLabel}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-bio-green-500 font-bold">{formatPrice(product.price)}</span>
                          )}
                          <span className="text-muted-foreground text-sm">Stock: {product.stock}</span>
                          <span className="text-muted-foreground text-sm capitalize">Category: {product.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                          className="border-border hover:border-bio-green-500"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="border-border hover:border-destructive text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-2xl font-bold">Orders</h2>
              <div className="w-full sm:w-80">
                <Input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order number..."
                  className="bg-background border-border focus:border-bio-green-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="bg-card/50 border-border/40">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                          <p className="font-semibold">{order.shippingInfo.fullName}</p>
                          <p className="text-sm text-muted-foreground">{order.shippingInfo.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-bio-green-500">{formatPrice(order.total)}</p>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32 mt-2 bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="border-t border-border pt-3">
                        <p className="text-sm font-medium mb-2">Items:</p>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                            <span>{item.name} x {item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-border pt-3 text-sm">
                        <p><span className="text-muted-foreground">Address:</span> {order.shippingInfo.address}</p>
                        <p><span className="text-muted-foreground">City:</span> {order.shippingInfo.city}, {order.shippingInfo.country}</p>
                        <p><span className="text-muted-foreground">Phone:</span> {order.shippingInfo.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Collections Management</h2>
              <Dialog open={showCollectionDialog} onOpenChange={(open) => {
                setShowCollectionDialog(open);
                if (!open) {
                  setEditingCollection(null);
                  resetCollectionForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-bio-green-500 hover:bg-bio-green-600 btn-glow">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Collection
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{editingCollection ? 'Edit Collection' : 'Add New Collection'}</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleCollectionSubmit} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Collection Name (English) *</Label>
                        <Input
                          value={collectionForm.name}
                          onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                          required
                          className="bg-background border-border"
                          placeholder="Rare Collectibles"
                        />
                      </div>
                      <div>
                        <Label>Collection Name (Arabic)</Label>
                        <Input
                          value={collectionForm.nameAr}
                          onChange={(e) => setCollectionForm({ ...collectionForm, nameAr: e.target.value })}
                          className="bg-background border-border"
                          placeholder="المقتنيات النادرة"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    {/* Description Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Description (English)</Label>
                        <Textarea
                          value={collectionForm.description}
                          onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                          className="bg-background border-border"
                          placeholder="Exclusive and rare items..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Description (Arabic)</Label>
                        <Textarea
                          value={collectionForm.descriptionAr}
                          onChange={(e) => setCollectionForm({ ...collectionForm, descriptionAr: e.target.value })}
                          className="bg-background border-border"
                          placeholder="عناصر حصرية ونادرة..."
                          dir="rtl"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Image */}
                    <div>
                      <Label>Collection Image *</Label>
                      <ImageUpload
                        value={collectionForm.image}
                        onChange={(url) => setCollectionForm({ ...collectionForm, image: url })}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload an image or enter a URL manually below
                      </p>
                      <Input
                        type="url"
                        value={collectionForm.image}
                        onChange={(e) => setCollectionForm({ ...collectionForm, image: e.target.value })}
                        className="bg-background border-border mt-2"
                        placeholder="Or paste image URL here (https://...)"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended size: 1200x400px
                      </p>
                    </div>

                    {/* Icon & Show on Home */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Icon Emoji</Label>
                        <Input
                          value={collectionForm.icon}
                          onChange={(e) => setCollectionForm({ ...collectionForm, icon: e.target.value })}
                          className="bg-background border-border text-2xl"
                          placeholder="📦"
                          maxLength={2}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Single emoji for collection icon
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 border border-border rounded-lg p-4 bg-background/50">
                        <input
                          type="checkbox"
                          id="showOnHome"
                          checked={collectionForm.showOnHome}
                          onChange={(e) => setCollectionForm({ ...collectionForm, showOnHome: e.target.checked })}
                          className="w-4 h-4 text-bio-green-500 border-gray-300 rounded focus:ring-bio-green-500"
                        />
                        <div className="flex-1">
                          <Label htmlFor="showOnHome" className="cursor-pointer font-semibold">
                            🏠 Show on Homepage
                          </Label>
                          <p className="text-xs text-muted-foreground">Display in home carousel</p>
                        </div>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {collectionForm.image && (
                      <div className="border border-border rounded-lg p-2">
                        <Label className="mb-2 block">Preview:</Label>
                        <div className="relative w-full h-32 rounded overflow-hidden">
                          <Image
                            src={collectionForm.image}
                            alt="Collection preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1 bg-bio-green-500 hover:bg-bio-green-600">
                        {editingCollection ? 'Update Collection' : 'Create Collection'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCollectionDialog(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Collections Grid */}
            <div className="grid gap-4">
              {collections.map((collection) => (
                <Card key={collection.id} className="bg-card/50 border-border/40 overflow-hidden">
                  <div className="flex items-center gap-4 p-4">
                    {/* Collection Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Collection Info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{collection.icon}</span>
                        <h3 className="font-semibold text-lg">{collection.name}</h3>
                        {collection.showOnHome && (
                          <span className="bg-bio-green-500/20 text-bio-green-500 text-xs font-semibold px-2 py-1 rounded border border-bio-green-500/30">
                            🏠 Homepage
                          </span>
                        )}
                      </div>
                      {collection.nameAr && (
                        <p className="text-sm text-muted-foreground mb-1" dir="rtl">{collection.nameAr}</p>
                      )}
                      {collection.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs text-muted-foreground">
                          Created: {new Date(collection.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCollection(collection)}
                        className="border-border"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCollection(collection.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {collections.length === 0 && (
                <Card className="bg-card/50 border-border/40 p-8 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Collections Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first collection to organize products
                  </p>
                  <Button
                    onClick={() => setShowCollectionDialog(true)}
                    className="bg-bio-green-500 hover:bg-bio-green-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Collection
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Store Customization Tab - NEW ADDITIVE FEATURE */}
          <TabsContent value="customization">
            <StoreCustomization />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
