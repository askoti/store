"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // NEW: Track if we are on the client

  // 1. Set mounted to true once we are in the browser
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("vault_manifest");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 2. Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("vault_manifest", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

// ... inside CartProvider
const addToCart = (product, quantity = 1, options = { openDrawer: true }) => {
  setCart((prev) => {
    const existing = prev.find((item) => item.id === product.id);
    if (existing) {
      return prev.map((item) =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
    }
    return [...prev, { ...product, quantity }];
  });

  // Only open cart if the option is true
  if (options.openDrawer) {
    setIsCartOpen(true);
  }
};


  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.salePrice || item.price;
    return acc + (price * item.quantity);
  }, 0);
  
  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      cartCount: isMounted ? cartCount : 0, // ONLY show count if mounted
      cartTotal, 
      isCartOpen, 
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);