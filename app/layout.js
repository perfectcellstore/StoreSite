import "./globals.css";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { CurrencyProvider } from "@/lib/contexts/CurrencyContext";
import { CartProvider } from "@/lib/contexts/CartContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { EffectsProvider } from "@/lib/contexts/EffectsContext";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import { CustomizationProvider } from "@/lib/contexts/CustomizationContext";
import { Toaster } from "@/components/ui/toaster";
import { GlobalClickEffects } from "@/components/GlobalClickEffects";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LowPowerModeWrapper } from "@/components/LowPowerModeWrapper";

export const metadata = {
  title: "Perfect Sell - Evolve Your Collection",
  description: "Discover epic collectibles, awesome replicas, and legendary gear that bring your favorite characters to life!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          <CurrencyProvider>
            <AuthProvider>
              <NotificationProvider>
                <CartProvider>
                  <EffectsProvider>
                    <CustomizationProvider>
                      <LowPowerModeWrapper />
                      <AnimatedBackground />
                      <GlobalClickEffects />
                      {children}
                      <Toaster />
                    </CustomizationProvider>
                  </EffectsProvider>
                </CartProvider>
              </NotificationProvider>
            </AuthProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
