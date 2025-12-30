'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { Palette, Type, Image as ImageIcon, Layout, RotateCcw, Save, Eye, Zap } from 'lucide-react';

export function StoreCustomization() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customization, setCustomization] = useState({
    // Colors & Theme
    colors: {
      primary: '#10b981',
      secondary: '#1f2937',
      accent: '#3b82f6',
      background: '#0a0a0a',
      backgroundSecondary: '#1a1a1a',
      buttonNormal: '#10b981',
      buttonHover: '#059669',
      textHeading: '#ffffff',
      textBody: '#d1d5db',
      textLink: '#10b981',
    },
    
    // Typography
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingSize: '2.5rem',
      bodySize: '1rem',
      textAlign: 'center',
    },
    
    // Homepage Content
    content: {
      heroTitle: 'Perfect Sell',
      heroSubtitle: 'Evolve Your Collection',
      heroDescription: 'Discover epic collectibles, awesome replicas, and legendary gear that bring your favorite characters to life!',
      featureTitle1: 'Authentic Quality',
      featureDesc1: 'Every item verified for authenticity and premium quality',
      featureTitle2: 'Fast Delivery',
      featureDesc2: 'Quick and secure delivery to your location',
      featureTitle3: 'Rare Finds',
      featureDesc3: 'Exclusive and limited edition collectibles',
    },
    
    // Images
    images: {
      logo: '',
      heroBanner: '',
      aboutBanner: '',
    },
    
    // Layout Controls
    layout: {
      showHeroSection: true,
      showFeaturesSection: true,
      showCategoriesSection: true,
      showAboutSection: true,
      heroSpacing: 'normal',
      sectionSpacing: 'normal',
    },
    
    // Animated Background Controls
    animation: {
      enabled: true,
      intensity: 'medium',
      speed: 'medium',
      opacity: 0.3,
      placement: 'global',
    },
  });

  useEffect(() => {
    fetchCustomization();
  }, []);

  const fetchCustomization = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/customization', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.customization) {
          setCustomization(data.customization);
        }
      }
    } catch (error) {
      console.error('Failed to fetch customization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/customization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(customization)
      });

      if (response.ok) {
        toast({
          title: 'Success! ✅',
          description: 'Customization settings saved successfully'
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save customization settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/customization/reset', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchCustomization();
        toast({
          title: 'Reset Complete',
          description: 'Settings restored to current defaults'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset settings',
        variant: 'destructive'
      });
    }
  };

  const updateColor = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const updateTypography = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      typography: { ...prev.typography, [key]: value }
    }));
  };

  const updateContent = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }));
  };

  const updateImage = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      images: { ...prev.images, [key]: value }
    }));
  };

  const updateLayout = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      layout: { ...prev.layout, [key]: value }
    }));
  };

  const updateAnimation = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      animation: { ...prev.animation, [key]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-12 w-12 border-4 border-bio-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Store Customization</h2>
          <p className="text-muted-foreground">Customize your store's appearance and content</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-bio-green-500 hover:bg-bio-green-600"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Customization Tabs */}
      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            Colors & Theme
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="content">
            <Type className="h-4 w-4 mr-2" />
            Content & Text
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="h-4 w-4 mr-2" />
            Images & Media
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4 mr-2" />
            Layout & Design
          </TabsTrigger>
        </TabsList>

        {/* Colors & Theme Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>Customize your store's color palette</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(customization.colors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={value}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={value}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Color Preview */}
          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="p-6 rounded-lg space-y-4"
                style={{ 
                  backgroundColor: customization.colors.background,
                  color: customization.colors.textBody 
                }}
              >
                <h3 
                  className="text-2xl font-bold"
                  style={{ color: customization.colors.textHeading }}
                >
                  Sample Heading
                </h3>
                <p>This is sample body text showing your color scheme.</p>
                <a 
                  href="#"
                  style={{ color: customization.colors.textLink }}
                  className="underline"
                >
                  Sample Link
                </a>
                <div className="flex gap-2">
                  <button
                    style={{ 
                      backgroundColor: customization.colors.buttonNormal,
                      color: '#ffffff'
                    }}
                    className="px-4 py-2 rounded-lg"
                  >
                    Normal Button
                  </button>
                  <button
                    style={{ 
                      backgroundColor: customization.colors.buttonHover,
                      color: '#ffffff'
                    }}
                    className="px-4 py-2 rounded-lg"
                  >
                    Hover State
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Font Settings</CardTitle>
              <CardDescription>Customize typography across your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Input
                  value={customization.typography.fontFamily}
                  onChange={(e) => updateTypography('fontFamily', e.target.value)}
                  placeholder="Inter, system-ui, sans-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heading Size</Label>
                  <Input
                    value={customization.typography.headingSize}
                    onChange={(e) => updateTypography('headingSize', e.target.value)}
                    placeholder="2.5rem"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Body Size</Label>
                  <Input
                    value={customization.typography.bodySize}
                    onChange={(e) => updateTypography('bodySize', e.target.value)}
                    placeholder="1rem"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Alignment</Label>
                <select
                  value={customization.typography.textAlign}
                  onChange={(e) => updateTypography('textAlign', e.target.value)}
                  className="w-full p-2 rounded-lg bg-background border border-border"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content & Text Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Homepage Hero Section</CardTitle>
              <CardDescription>Edit hero section text content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input
                  value={customization.content.heroTitle}
                  onChange={(e) => updateContent('heroTitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Input
                  value={customization.content.heroSubtitle}
                  onChange={(e) => updateContent('heroSubtitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Hero Description</Label>
                <Textarea
                  value={customization.content.heroDescription}
                  onChange={(e) => updateContent('heroDescription', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Feature Sections</CardTitle>
              <CardDescription>Edit feature card content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-3 p-4 border border-border rounded-lg">
                  <h4 className="font-semibold">Feature {num}</h4>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={customization.content[`featureTitle${num}`]}
                      onChange={(e) => updateContent(`featureTitle${num}`, e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={customization.content[`featureDesc${num}`]}
                      onChange={(e) => updateContent(`featureDesc${num}`, e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images & Media Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Store Images</CardTitle>
              <CardDescription>Upload and manage store images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Store Logo</Label>
                <p className="text-sm text-muted-foreground">Upload a new logo or leave empty to use default</p>
                <Input
                  type="url"
                  value={customization.images.logo}
                  onChange={(e) => updateImage('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                {customization.images.logo && (
                  <div className="mt-2 p-4 border border-border rounded-lg">
                    <img 
                      src={customization.images.logo} 
                      alt="Logo Preview" 
                      className="max-h-20 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Hero Banner Image</Label>
                <p className="text-sm text-muted-foreground">Background image for homepage hero section</p>
                <Input
                  type="url"
                  value={customization.images.heroBanner}
                  onChange={(e) => updateImage('heroBanner', e.target.value)}
                  placeholder="https://example.com/hero-banner.jpg"
                />
                {customization.images.heroBanner && (
                  <div className="mt-2 p-4 border border-border rounded-lg">
                    <img 
                      src={customization.images.heroBanner} 
                      alt="Hero Banner Preview" 
                      className="max-h-40 w-full object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>About Section Banner</Label>
                <p className="text-sm text-muted-foreground">Image for about/info sections</p>
                <Input
                  type="url"
                  value={customization.images.aboutBanner}
                  onChange={(e) => updateImage('aboutBanner', e.target.value)}
                  placeholder="https://example.com/about-banner.jpg"
                />
                {customization.images.aboutBanner && (
                  <div className="mt-2 p-4 border border-border rounded-lg">
                    <img 
                      src={customization.images.aboutBanner} 
                      alt="About Banner Preview" 
                      className="max-h-40 w-full object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout & Design Tab */}
        <TabsContent value="layout" className="space-y-6">
          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Section Visibility</CardTitle>
              <CardDescription>Show or hide different sections of your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'showHeroSection', label: 'Hero Section' },
                { key: 'showFeaturesSection', label: 'Features Section' },
                { key: 'showCategoriesSection', label: 'Categories Section' },
                { key: 'showAboutSection', label: 'About Section' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <Label className="cursor-pointer">{label}</Label>
                  <Switch
                    checked={customization.layout[key]}
                    onCheckedChange={(checked) => updateLayout(key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle>Spacing Controls</CardTitle>
              <CardDescription>Adjust spacing and padding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Section Spacing</Label>
                <select
                  value={customization.layout.heroSpacing}
                  onChange={(e) => updateLayout('heroSpacing', e.target.value)}
                  className="w-full p-2 rounded-lg bg-background border border-border"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Section Spacing</Label>
                <select
                  value={customization.layout.sectionSpacing}
                  onChange={(e) => updateLayout('sectionSpacing', e.target.value)}
                  className="w-full p-2 rounded-lg bg-background border border-border"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="bg-bio-green-500 hover:bg-bio-green-600"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}
