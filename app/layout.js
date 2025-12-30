import "./globals.css";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { CurrencyProvider } from "@/lib/contexts/CurrencyContext";
import { CartProvider } from "@/lib/contexts/CartContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Perfect Sell - Evolve Your Collection",
  description: "Discover rare collectibles, historical treasures, and premium gear from across the multiverse",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          <CurrencyProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
