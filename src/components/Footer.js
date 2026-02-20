"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white pt-20 pb-0 overflow-hidden border-t border-white/10">
      
      {/* 1. THE BASE GRID */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none z-0" 
        style={{ 
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* 2. THE STOREFRONT CUBES (SQUARES) */}
      {/* Increased opacity and z-index to ensure they are visible */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Top Left Square */}
        <div className="absolute top-10 left-[10%] w-32 h-32 border border-white/20 bg-white/5 rotate-[15deg] backdrop-blur-sm" />
        
        {/* Middle Right Square */}
        <div className="absolute top-1/2 right-[15%] w-40 h-40 border border-white/10 bg-white/[0.03] -rotate-[10deg]" />
        
        {/* Bottom Left Square */}
        <div className="absolute -bottom-10 left-[20%] w-24 h-24 border border-white/20 bg-white/5 rotate-[45deg]" />
        
        {/* Small Accent Square near Newsletter */}
        <div className="absolute top-20 right-[30%] w-12 h-12 border border-[#d4ff3f]/20 bg-[#d4ff3f]/5 rotate-12" />
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="relative max-w-[1800px] mx-auto z-20 px-6 md:px-10">
        
        {/* TOP NAV & NEWSLETTER */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-12 relative z-30 mb-10">
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 w-full lg:w-auto">
            <span className="text-[11px] font-black italic uppercase tracking-[0.4em] text-[#d4ff3f]">AskStore</span>
            
            <nav className="flex flex-col gap-1">
              <span className="text-[9px] text-white/30 uppercase mb-3 tracking-[0.4em] font-bold italic">[ MENU ]</span>
              {['Home', 'About', 'Blog', 'Contact'].map((item) => (
                <Link key={item} href="#" className="text-[13px] font-black uppercase tracking-tight hover:text-[#d4ff3f] leading-none mb-1 transition-colors">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* THE TOXIC GREEN PILL */}
          <div className="w-full lg:w-[400px] flex flex-col items-start lg:items-end relative z-40">
            <div className="flex justify-between w-full mb-3 px-2 text-[10px] font-black uppercase italic">
               <span className="tracking-[0.2em]">SIGN UP</span>
               <span className="text-white/40 tracking-[0.2em] hidden sm:block">TO OUR NEWSLETTER</span>
            </div>
            <div className="relative w-full">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="w-full bg-[#d4ff3f] text-black placeholder:text-black/40 py-3 px-6 rounded-full font-black text-[11px] outline-none uppercase italic"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 aspect-square h-[calc(100%-12px)] bg-black rounded-full flex items-center justify-center text-[#d4ff3f] hover:scale-90 transition-transform">
                <span className="text-lg font-bold">↘</span>
              </button>
            </div>
          </div>
        </div>

        {/* THE "FALLING" 3D PERSPECTIVE TEXT */}
        <div className="relative w-full flex justify-center mt-10" style={{ perspective: '800px' }}>
          <h2 
            suppressHydrationWarning
            className="text-[14vw] md:text-[12vw] font-black uppercase italic leading-[0.8] tracking-[-0.04em] whitespace-nowrap text-white origin-center select-none z-30"
            style={{
              transform: 'rotateX(50deg) scaleY(3.2)',
              textShadow: '0px 15px 40px rgba(0,0,0,0.8)'
            }}
          >
            JUST ASK
          </h2>
        </div>

        {/* OVERLAID LEGAL BOTTOM BAR */}
        <div className="relative z-40 pt-10 pb-10 mt-12 md:mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/30 gap-6">
            <p className="text-center md:text-left order-2 md:order-1">© ASKSTORE / ALL RIGHTS RESERVED</p>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-white/40 order-1 md:order-2">
              <Link href="#" className="hover:text-white transition-colors">Public Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Research</Link>
              <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
            </div>
            
            <p className="hidden md:block order-3 italic opacity-20 uppercase tracking-widest text-[8px]">Index_Ref_00491</p>
          </div>
        </div>
      </div>
    </footer>
  );
}