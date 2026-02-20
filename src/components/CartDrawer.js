"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

export default function CartDrawer() {
  const { cart, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const [step, setStep] = useState("manifest");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsCartOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsCartOpen]);

  const handleSimulatedCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      alert("ACQUISITION SUCCESS: Order Confirmed.");
      setIsProcessing(false);
      setIsCartOpen(false);
      setStep("manifest");
    }, 2000);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex justify-end transition-all duration-500 ${isCartOpen ? "visible" : "invisible"}`}>
      
      {/* OVERLAY: Deep Black Fade */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => { setIsCartOpen(false); setStep("manifest"); }}
      />

      {/* ASIDE: Black Theme with Toxic Accents */}
      <aside className={`
        relative w-full max-w-md bg-black border-l border-white/10 h-full flex flex-col shadow-2xl
        transition-transform duration-500 ease-out transform
        ${isCartOpen ? "translate-x-0" : "translate-x-full"}
      `}>

        {/* FOOTER-STYLE GRID OVERLAY */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        
        {/* HEADER */}
        <div className="relative z-10 p-8 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md">
          <div className="space-y-1">
            <h2 className="text-[14px] font-black uppercase tracking-[0.4em] italic text-white">
              {step === 'manifest' ? '[ MANIFEST ]' : '[ AUTH ]'}
            </h2>
            <p className="text-[8px] font-black text-[#d4ff3f] uppercase tracking-[0.3em]">
              Status: Secure Protocol
            </p>
          </div>
          <button 
            onClick={() => { setIsCartOpen(false); setStep("manifest"); }} 
            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#d4ff3f] transition-all"
          >
            Close x
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="relative z-10 flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {step === "manifest" ? (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20" style={{ perspective: '500px' }}>
                  <h2 className="text-[8vw] font-black uppercase italic text-white/10"
                      style={{ transform: 'rotateX(20deg) scaleY(1.5)' }}>
                    EMPTY
                  </h2>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border border-white/10 p-4 bg-white/5 group">
                    <div className="w-20 h-24 bg-white border border-white/10 flex-shrink-0 relative overflow-hidden">
                      <img src={item.images[0]} className="w-full h-full object-contain p-2 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-[11px] font-black uppercase italic text-white tracking-widest leading-none">{item.name}</h3>
                          <p className="text-[9px] font-bold text-[#d4ff3f] uppercase tracking-tighter italic">
                            ${(item.salePrice || item.price).toFixed(2)} [x{item.quantity}]
                          </p>
                        </div>
                        <p className="text-[11px] font-black text-white italic tracking-tighter">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[9px] font-black uppercase text-red-500/60 hover:text-red-500 transition-colors w-fit italic underline underline-offset-4 decoration-1">
                        Delete Item
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <form id="checkout-form" onSubmit={handleSimulatedCheckout} className="flex flex-col space-y-8 p-1">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/90 uppercase tracking-[0.3em]">Customer Identity</label>
                <input required type="text" placeholder="NAME" className="w-full bg-white/5 border border-white/30 p-4 text-[11px] font-black outline-none focus:border-[#d4ff3f] transition-all uppercase placeholder:text-white/70 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/90 uppercase tracking-[0.3em]">Communication Link</label>
                <input required type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/30 p-4 text-[11px] font-black outline-none focus:border-[#d4ff3f] transition-all uppercase placeholder:text-white/70 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/90 uppercase tracking-[0.3em]">Acquisition Funding</label>
                <input required type="text" placeholder="CARD DATA" className="w-full bg-white/5 border border-white/30 p-4 text-[11px] font-black outline-none focus:border-[#d4ff3f] transition-all uppercase placeholder:text-white/70 text-white" />
              </div>
            </form>
          )}
        </div>

        {/* FOOTER */}
        <div className="relative z-10 p-8 border-t border-white/10 bg-black space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Total Value</span>
            <span className="text-3xl font-black text-[#d4ff3f] tracking-tighter italic">${cartTotal.toFixed(2)}</span>
          </div>
          {step === "manifest" ? (
            <button 
              onClick={() => setStep("auth")}
              disabled={cart.length === 0}
              className="w-full bg-[#d4ff3f] text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] italic hover:bg-white transition-all active:scale-[0.98] disabled:opacity-10 border border-[#d4ff3f]"
            >
              Initialize Checkout
            </button>
          ) : (
            <div className="space-y-3">
              <button 
                form="checkout-form"
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#d4ff3f] text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] italic border border-[#d4ff3f] hover:bg-white transition-all disabled:opacity-50"
              >
                {isProcessing ? "TRANSMITTING..." : "Complete Acquisition"}
              </button>
              <button onClick={() => setStep("manifest")} className="w-full text-[9px] font-black text-white/30 uppercase tracking-[0.2em] py-2 hover:text-white transition-colors italic">
                [ Return to Manifest ]
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}