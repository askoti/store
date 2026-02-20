import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} // [${product.category}]`,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-[#ecebe4] text-black selection:bg-[#d4ff3f] selection:text-black relative">
      {/* GRID OVERLAY */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-12 lg:py-20">
        
        {/* NAV BAR */}
        <nav className="mb-12">
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs group-hover:bg-[#d4ff3f] group-hover:text-black transition-colors">
              ←
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Return / Catalog
            </span>
          </Link>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
          
          {/* LEFT: GALLERY BOX (Centered vertically with aside) */}
          <div className="flex-1">
             <div className="bg-[#e2e1da] border border-black/5 p-6 md:p-10 h-full flex items-center">
                <ProductGallery images={product.images} name={product.name} />
             </div>
          </div>

          {/* RIGHT: DATA COLUMN (Aligned and slightly wider) */}
          <aside className="w-full lg:w-[420px] flex flex-col justify-center space-y-10">
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-black pb-4">
                 <span className="bg-black text-white text-[9px] font-black px-2 py-1 uppercase tracking-tighter">
                   {product.category}
                 </span>
                 <span className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em]">
                   SEC_ID: {product.id.slice(0, 8)}
                 </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-[0.8] text-black">
                {product.name}
              </h1>

              <div className="pt-2 flex items-baseline gap-4">
                <span className="text-4xl font-black tracking-tighter italic">
                  ${(product.salePrice || product.price).toFixed(2)}
                </span>
                {product.salePrice && (
                  <span className="text-sm font-bold text-black/20 line-through uppercase">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="p-6 border-l-4 border-black bg-white/50 backdrop-blur-sm">
              <p className="text-[12px] font-bold leading-relaxed text-black/70 uppercase tracking-tight">
                {product.description}
              </p>
            </div>

            {/* ACTION AREA */}
            <div className="space-y-8">
              <div className="w-full">
                <AddToCartButton product={product} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-black/10 p-4 bg-white/10">
                    <span className="block text-[8px] font-black opacity-30 uppercase mb-2 tracking-widest">Stock_Status</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.quantity > 0 ? 'bg-[#d4ff3f]' : 'bg-red-500'} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {product.quantity > 0 ? `Units: ${product.quantity}` : 'Depleted'}
                        </span>
                    </div>
                </div>
                <div className="border border-black/10 p-4 bg-white/10">
                    <span className="block text-[8px] font-black opacity-30 uppercase mb-2 tracking-widest">Delivery</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Worldwide_Exp</span>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}