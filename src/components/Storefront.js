"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Storefront({ initialProducts }) {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false); // To prevent hydration mismatch
  
  const itemsPerPage = 16; 

  // Wait until mounted to ensure client/server match
  useEffect(() => {
    setMounted(true);
  }, []);

  const search = searchParams.get("search") || "";
  const activeCategory = searchParams.get("category") || "All";

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory, initialProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // If not mounted, render a simplified version or null to avoid mismatch
  if (!mounted) return <div className="min-h-screen bg-[#ecebe4]" />;

  return (
    <div className="relative min-h-screen bg-[#ecebe4] text-black font-sans px-4 md:px-10 py-8">
      
      {/* GRID OVERLAY */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* HUGE TITLE HEADER */}
        <header className="mb-12 flex items-center gap-4">
          <h1 className="text-5xl md:text-[5rem] font-black uppercase tracking-tighter leading-none">
            {activeCategory === "All" ? "ALL" : activeCategory}
          </h1>
          <span className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border border-black/10 text-lg font-bold">
            {filteredProducts.length}
          </span>
        </header>

        {/* COMPACT PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedProducts.map((product) => (
            <Link 
              href={`/product/${product.id}`} 
              key={product.id} 
              className="group block bg-[#e2e1da] border border-black/5 hover:border-black/20 transition-all"
            >
              <div className="relative aspect-square flex items-center justify-center p-8">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className="absolute bottom-3 right-3 bg-[#d4ff3f] w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>

              <div className="p-3 border-t border-black/5 bg-white/30">
                <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest truncate">
                  {product.name}
                </h2>
                <p className="text-[10px] font-bold opacity-40 mt-0.5">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => { 
                    setCurrentPage(i + 1); 
                    window.scrollTo({top: 0, behavior: 'smooth'}); 
                }}
                className={`w-10 h-10 text-[10px] font-black transition-all ${
                  currentPage === i + 1 
                    ? "bg-[#d4ff3f] text-black" 
                    : "bg-white/50 text-black/30 hover:bg-white"
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}