"use client";
import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const [activeImage, setActiveImage] = useState(images?.[0] || "");

  return (
    <section className="flex-1 p-4 md:p-0">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        
        {/* MAIN STAGE (Shows first on mobile) */}
        <div className="flex-1 order-1 md:order-2">
          <div className="relative aspect-square border border-white/10 flex items-center justify-center overflow-hidden group">
            
            {/* CORNER ACCENTS */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 w-4 h-4 md:w-6 md:h-6 border-t border-l border-white/20 z-10" />
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-4 h-4 md:w-6 md:h-6 border-b border-r border-white/20 z-10" />
            
            <img 
              src={activeImage || images?.[0]} 
              alt={name}
              className="w-[80%] h-[80%] md:w-[70%] md:h-[70%] object-contain transition-all duration-700 ease-in-out md:group-hover:scale-125"
            />
            
            {/* BRAND WATERMARK */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 pointer-events-none">
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white opacity-20 rotate-90 origin-left whitespace-nowrap">
                    {name} // REF_VIEW_00
                </p>
            </div>

            {/* HOVER OVERLAY TEXT - Hidden on mobile touch */}
            <div className="hidden md:block absolute top-10 right-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500">
               <p className="text-[8px] font-black text-white uppercase tracking-widest">Zoom_Active</p>
            </div>
          </div>
        </div>

        {/* THUMBNAILS (Horizontal scroll on mobile, Vertical on desktop) */}
        <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-visible pb-2 md:pb-0 scrollbar-hide">
          {images?.map((img, i) => (
            <button 
              key={i}
              onClick={() => setActiveImage(img)}
              className={`relative flex-shrink-0 w-16 h-16 md:w-24 md:h-24 transition-all duration-300 ${
                activeImage === img 
                  ? ' border-2 border-[#d4ff3f]' 
                  : 'border border-white/10 hover:border-white/40'
              }`}
            >
              <img 
                src={img} 
                className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
                    activeImage === img ? 'opacity-100' : 'opacity-50'
                }`} 
                alt={`${name} thumb ${i}`} 
              />
              <span className={`absolute -bottom-1 -right-1 text-[7px] md:text-[8px] font-black px-1.5 py-0.5 ${
                activeImage === img ? 'bg-[#d4ff3f] text-black' : 'bg-white text-black opacity-40'
              }`}>
                0{i + 1}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}