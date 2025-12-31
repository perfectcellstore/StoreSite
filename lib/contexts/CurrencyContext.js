'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CurrencyContext = createContext();

// Exchange rates (base: USD)
const USD_TO_IQD_RATE = 1400;
const USD_TO_EUR_RATE = 0.8547; // 1 EUR = 1.17 USD

// Default currency is IQD
const DEFAULT_CURRENCY = 'IQD';

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    // Load saved currency, default to IQD if not set
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency && ['USD', 'IQD', 'EUR'].includes(savedCurrency)) {
      setCurrency(savedCurrency);
    } else {
      // Set default to IQD and save it
      localStorage.setItem('currency', DEFAULT_CURRENCY);
    }
  }, []);

  const toggleCurrency = useCallback(() => {
    const currencies = ['IQD', 'USD', 'EUR']; // IQD first as default
    const currentIndex = currencies.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    const newCurrency = currencies[nextIndex];
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  }, [currency]);

  const convertPrice = useCallback((priceInUSD) => {
    switch (currency) {
      case 'IQD':
        return Math.round(priceInUSD * USD_TO_IQD_RATE);
      case 'EUR':
        return priceInUSD * USD_TO_EUR_RATE;
      default:
        return priceInUSD;
    }
  }, [currency]);

  const formatPrice = useCallback((priceInUSD, isAlreadyConverted = false) => {
    const amount = isAlreadyConverted ? priceInUSD : convertPrice(priceInUSD);
    
    switch (currency) {
      case 'IQD':
        return `${amount.toLocaleString()} IQD`;
      case 'EUR':
        return `€${amount.toFixed(2)}`;
      default:
        return `$${amount.toFixed(2)}`;
    }
  }, [currency, convertPrice]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currency,
    toggleCurrency,
    convertPrice,
    formatPrice
  }), [currency, toggleCurrency, convertPrice, formatPrice]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
