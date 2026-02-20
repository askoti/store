"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CATEGORIES = [
  "All",
  "Charging",
  "Desk Setup",
  "Audio",
  "Travel Tech",
  "Smart Home",
  "Wearables",
  "Cables & Adapters",
  "Lighting",
  "PC & Laptops",
  "Keyboards",
  "Headphones",
  "Mice",
  "Limited",
  "Accessories"
];
export default function Navbar() {
  const { cart, setIsCartOpen } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const distinctCount = cart.length;

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  if (!mounted) return <div className="h-20 bg-black border-b border-white/10" />;

  return (
    <nav className="sticky top-0 z-50 w-full bg-black text-white border-b border-white/10 overflow-hidden">
      {/* FOOTER-STYLE GRID OVERLAY */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="relative z-10 max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between gap-8">

        {/* LOGO: Matching Footer Spacing */}
        <Link
          href="/"
          className="text-lg font-black tracking-[0.4em] uppercase italic group transition-all"
        >
          Ask<span className="text-[#d4ff3f]">Store</span>
        </Link>

        {/* CENTER: SEARCH & CATEGORY (Technical Black Box) */}
        <div className="flex-1 max-w-xl hidden md:flex items-center border border-white/10 h-11 bg-white/5 backdrop-blur-sm">
          <div className="relative h-full flex items-center border-r border-white/10">
            <select
              value={searchParams.get("category") || "All"}
              onChange={(e) => updateParams("category", e.target.value)}
              className="h-full bg-transparent text-[8px] font-black uppercase tracking-widest px-6 outline-none cursor-pointer text-white hover:text-[#d4ff3f] transition-all appearance-none pr-10"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-black text-white">
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="absolute right-4 pointer-events-none text-[8px] opacity-40">▼</span>
          </div>

          <input
            type="text"
            defaultValue={searchParams.get("search") || ""}
            placeholder="SEARCH_CATALOG_"
            onChange={(e) => updateParams("search", e.target.value)}
            className="flex-1 h-full bg-transparent px-5 text-[9px] font-black uppercase tracking-[0.2em] outline-none placeholder:text-white/20 focus:bg-white/5"
          />
        </div>

        {/* RIGHT: LINKS & THE GREEN CART BOX */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link 
            href="/" 
            className="hidden lg:block text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#d4ff3f] transition-colors italic"
          >
            [ Collection ]
          </Link>

          {/* CART: High Contrast Pill style from Footer Newsletter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center h-10 group transition-all"
          >
            <div className="bg-[#d4ff3f] text-black h-full px-5 flex items-center rounded-l-full border border-[#d4ff3f] group-hover:bg-white group-hover:border-white transition-all">
               <span className="text-[10px] font-black uppercase tracking-widest italic">Cart</span>
            </div>
            <div className="h-full px-4 flex items-center min-w-[45px] justify-center border-y border-r border-white/20 rounded-r-full text-[11px] font-black bg-white/5 group-hover:bg-white group-hover:text-black transition-all">
              {distinctCount.toString().padStart(2, '0')}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}