import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import SystemLoader from "@/components/SystemLoader";

export const metadata = {
  title: {
    default: "ASKSTORE // SYSTEM_INDEX",
    template: "%s | ASKSTORE",
  },
  description: "High-performance tech accessories and curated hardware inventory.",
  icons: {
    icon: "/favicon.ico", // Ensure this exists in your /public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased" suppressHydrationWarning={true}>
        <CartProvider>
        <Suspense fallback={<SystemLoader />}>
          <Navbar />
        </Suspense>
          {children}
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}