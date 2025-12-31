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

  const toggleCurrency = () => {
    const currencies = ['USD', 'IQD', 'EUR'];
    const currentIndex = currencies.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    const newCurrency = currencies[nextIndex];
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const convertPrice = (priceInUSD) => {
    if (currency === 'IQD') {
      return priceInUSD * USD_TO_IQD_RATE;
    }
    if (currency === 'EUR') {
      return priceInUSD * USD_TO_EUR_RATE;
    }
    return priceInUSD;
  };

  const formatPrice = (priceInUSD, isAlreadyConverted = false) => {
    let amount = priceInUSD;
    
    // If not already converted, convert it
    if (!isAlreadyConverted) {
      amount = convertPrice(priceInUSD);
    }
    
    if (currency === 'IQD') {
      return `${amount.toLocaleString()} IQD`;
    }
    if (currency === 'EUR') {
      return `€${amount.toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, convertPrice, formatPrice }}>
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
