"use client";
import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart, cart } = useCart();
  const [qty, setQty] = useState(1);

  const inCartQty = useMemo(() => {
    const item = cart.find((i) => i.id === product.id);
    return item ? item.quantity : 0;
  }, [cart, product.id]);

  const availableStock = product.quantity - inCartQty;

  const increment = () => {
    if (qty < availableStock) setQty(qty + 1);
  };
  
  const decrement = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleAdd = () => {
    addToCart(product, qty, { openDrawer: false });
    setQty(1); 
  };

  return (
    <div className="space-y-4">
      {/* COMPACT QUANTITY SELECTOR */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[8px] font-black text-black opacity-30 uppercase tracking-[0.2em]">
            Select Quantity
          </label>
        </div>
        
        <div className="flex items-center border border-black h-11 w-full bg-white/50 backdrop-blur-sm">
          <button 
            type="button"
            onClick={decrement}
            disabled={qty <= 1 || availableStock <= 0}
            className="w-12 h-full text-black hover:bg-[#d4ff3f] disabled:opacity-10 transition-colors border-r border-black font-bold text-sm"
          >
            —
          </button>
          
          <div className="flex-1 text-center text-[11px] font-black tracking-widest text-black">
            {availableStock > 0 ? qty.toString().padStart(2, '0') : "00"}
          </div>

          <button 
            type="button"
            onClick={increment}
            disabled={qty >= availableStock || availableStock <= 0}
            className="w-12 h-full text-black hover:bg-[#d4ff3f] disabled:opacity-10 transition-colors border-l border-black font-bold text-sm"
          >
            +
          </button>
        </div>
      </div>

      {/* CORE ACTION BUTTON */}
      <div className="relative group">
        <button 
          onClick={handleAdd}
          disabled={availableStock <= 0}
          className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all active:scale-[0.98] disabled:bg-black/5 disabled:text-black/20 disabled:border-transparent border border-black hover:bg-[#d4ff3f] hover:text-black"
        >
          {availableStock > 0 ? 'Initialize Acquisition' : 'Out of Stock'}
        </button>
        
        {/* Subtle decorative line for the SD look */}
        <div className="absolute -bottom-1 -right-1 w-full h-full border-r border-b border-black/10 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
      </div>

      {/* IN-CART STATUS */}
      {inCartQty > 0 && (
        <div className="flex items-center justify-between pt-2 px-1 border-t border-black/5">
          <p className="text-[8px] font-bold text-black/40 uppercase tracking-widest">
            Inventory Linked
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-black bg-[#d4ff3f] px-1.5 py-0.5 rounded-full border border-black/10">
              {inCartQty} Units in Cart
            </span>
          </div>
        </div>
      )}

    </div>
  );
}