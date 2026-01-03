'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CurrencyContext = createContext();

// Exchange rates (base: USD)
const USD_TO_IQD_RATE = 1400;
const USD_TO_EUR_RATE = 0.8547; // 1 EUR = 1.17 USD

// Default currency is IQD
const DEFAULT_CURRENCY = 'IQD';

/**
 * Round IQD prices to nearest multiple of 250
 * e.g., 10680 -> 10750, 10500 -> 10500, 10620 -> 10500
 */
function roundIQDPrice(price) {
  return Math.round(price / 250) * 250;
}

/**
 * Round USD/EUR prices to end in .49 or .99
 * e.g., 10.37 -> 10.49, 10.75 -> 10.99, 10.12 -> 9.99
 */
function roundToNineOrFortyNine(price) {
  const whole = Math.floor(price);
  const decimal = price - whole;
  
  // Determine which ending is closer
  // Options: .49 or .99 (or previous .99 like 9.99 for 10.12)
  const distTo49 = Math.abs(decimal - 0.49);
  const distTo99 = Math.abs(decimal - 0.99);
  const distToPrev99 = Math.abs(decimal + 0.01); // distance to (whole - 0.01), i.e., prev .99
  
  if (distTo49 <= distTo99 && distTo49 <= distToPrev99) {
    return whole + 0.49;
  } else if (distTo99 <= distToPrev99) {
    return whole + 0.99;
  } else {
    // Use previous .99 (e.g., 10.12 -> 9.99)
    return whole - 0.01;
  }
}

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
