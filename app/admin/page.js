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
  const [loading, setLoading] = useState(true);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [productForm, setProductForm] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    category: 'collectibles',
    image: '',
    stock: ''
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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/products'),
        fetch('/api/orders', { headers })
      ]);

      const statsData = await statsRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      setStats(statsData.stats);
      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
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

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock)
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Product ${editingProduct ? 'updated' : 'created'} successfully`
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
      category: 'collectibles',
      image: '',
      stock: ''
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
      category: product.category,
      image: product.image,
      stock: product.stock.toString()
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
                        <Label>Price (USD)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                          className="bg-background border-border"
                        />
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
                      <div>
                        <Label>Category</Label>
                        <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="collectibles">Collectibles</SelectItem>
                            <SelectItem value="historical">Historical</SelectItem>
                            <SelectItem value="cosplay">Cosplay</SelectItem>
                            <SelectItem value="weapons">Weapons</SelectItem>
                            <SelectItem value="figures">Figures</SelectItem>
                            <SelectItem value="masks">Masks</SelectItem>
                            <SelectItem value="toys">Toys</SelectItem>
                            <SelectItem value="rare">Rare</SelectItem>
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
                        <div className="flex gap-4 mt-2">
                          <span className="text-bio-green-500 font-bold">{formatPrice(product.price)}</span>
                          <span className="text-muted-foreground">Stock: {product.stock}</span>
                          <span className="text-muted-foreground capitalize">Category: {product.category}</span>
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
            <h2 className="text-2xl font-bold">Orders</h2>
            
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
