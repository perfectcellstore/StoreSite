'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const EffectsContext = createContext();

export function EffectsProvider({ children }) {
  const [effectsEnabled, setEffectsEnabled] = useState(true);

  // Load preference from localStorage on mount
  useEffect(() => {
    const savedEffects = localStorage.getItem('effectsEnabled');
    if (savedEffects !== null) {
      setEffectsEnabled(savedEffects === 'true');
    }
  }, []);

  const toggleEffects = useCallback(() => {
    setEffectsEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('effectsEnabled', newValue.toString());
      return newValue;
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ 
    effectsEnabled, 
    toggleEffects
  }), [effectsEnabled, toggleEffects]);

  return (
    <EffectsContext.Provider value={value}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const context = useContext(EffectsContext);
  if (!context) {
    throw new Error('useEffects must be used within EffectsProvider');
  }
  return context;
}
