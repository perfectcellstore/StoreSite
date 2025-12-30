'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const USD_TO_IQD_RATE = 1400;

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    setCurrency(savedCurrency);
  }, []);

  const toggleCurrency = () => {
    const newCurrency = currency === 'USD' ? 'IQD' : 'USD';
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const convertPrice = (priceInUSD) => {
    if (currency === 'IQD') {
      return priceInUSD * USD_TO_IQD_RATE;
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
