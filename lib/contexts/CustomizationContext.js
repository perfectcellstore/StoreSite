'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomizationContext = createContext();

const defaultCustomization = {
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
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingSize: '2.5rem',
    bodySize: '1rem',
    textAlign: 'center',
  },
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
  images: {
    logo: '',
    heroBanner: '',
    aboutBanner: '',
  },
  layout: {
    showHeroSection: true,
    showFeaturesSection: true,
    showCategoriesSection: true,
    showAboutSection: true,
    heroSpacing: 'normal',
    sectionSpacing: 'normal',
  },
};

export function CustomizationProvider({ children }) {
  const [customization, setCustomization] = useState(defaultCustomization);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomization();
  }, []);

  const fetchCustomization = async () => {
    try {
      const response = await fetch('/api/customization/public');
      
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

  return (
    <CustomizationContext.Provider value={{ customization, loading }}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within CustomizationProvider');
  }
  return context;
}
