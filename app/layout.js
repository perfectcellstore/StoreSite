import "./globals.css";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { CurrencyProvider } from "@/lib/contexts/CurrencyContext";
import { CartProvider } from "@/lib/contexts/CartContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { EffectsProvider } from "@/lib/contexts/EffectsContext";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";
import { CustomizationProvider } from "@/lib/contexts/CustomizationContext";
import { PerfProvider } from "@/lib/contexts/PerfContext";
import { Toaster } from "@/components/ui/toaster";
import PerfDynamicLayers from "@/components/PerfDynamicLayers";
import AudioBootstrapper from "@/components/AudioBootstrapper";
import { GlobalClickSound } from "@/components/GlobalClickSound";
import { LanguageSelectionPopup } from "@/components/LanguageSelectionPopup";

export const metadata = {
  title: "Perfect Sell - Evolve Your Collection",
  description: "Discover epic collectibles, awesome replicas, and legendary gear that bring your favorite characters to life!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <CurrencyProvider>
            <AuthProvider>
              <NotificationProvider>
                <CartProvider>
                  <EffectsProvider>
                    <PerfProvider>
                      <CustomizationProvider>
                        <AudioBootstrapper />
                        <GlobalClickSound />
                        <PerfDynamicLayers />
                        <LanguageSelectionPopup />
                        {children}
                        <Toaster />
                      </CustomizationProvider>
                    </PerfProvider>
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
