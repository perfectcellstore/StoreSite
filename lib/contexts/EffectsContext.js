'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const EffectsContext = createContext();

export function EffectsProvider({ children }) {
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedEffects = localStorage.getItem('effectsEnabled');
    if (savedEffects !== null) {
      setEffectsEnabled(savedEffects === 'true');
    }
    
    const savedLowPower = localStorage.getItem('lowPowerMode');
    if (savedLowPower !== null) {
      setLowPowerMode(savedLowPower === 'true');
    }
  }, []);

  const toggleEffects = () => {
    setEffectsEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('effectsEnabled', newValue.toString());
      return newValue;
    });
  };

  const toggleLowPowerMode = () => {
    setLowPowerMode(prev => {
      const newValue = !prev;
      localStorage.setItem('lowPowerMode', newValue.toString());
      return newValue;
    });
  };

  return (
    <EffectsContext.Provider value={{ 
      effectsEnabled, 
      toggleEffects,
      lowPowerMode,
      toggleLowPowerMode
    }}>
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
