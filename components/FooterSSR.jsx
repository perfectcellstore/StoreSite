// Server wrapper for the client Footer.
// Fixes hydration mismatches by providing a stable year value computed on the server
// and passed as a prop to the client component.

import React from 'react';
import { Footer as FooterClient } from '@/components/Footer';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return <FooterClient currentYear={currentYear} />;
}
