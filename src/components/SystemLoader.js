// src/components/SystemLoader.js
export default function SystemLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20 bg-black">
      <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
        {/* The class name will be 'animate-loading-bar' based on the variable above */}
        <div className="absolute inset-0 bg-[#d4ff3f] animate-loading-bar shadow-[0_0_15px_#d4ff3f]" />
      </div>
      
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4ff3f] animate-pulse italic">
          Decrypting_Assets...
        </span>
      </div>
    </div>
  );
}