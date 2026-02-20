// app/admin/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("AWAITING_CREDENTIALS");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("VERIFYING...");

    // For a simple setup, we use an API route to set a secure cookie
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setStatus("ACCESS_GRANTED");
      router.push("/admin");
      router.refresh();
    } else {
      setStatus("ACCESS_DENIED");
      setTimeout(() => setStatus("AWAITING_CREDENTIALS"), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center font-sans relative overflow-hidden">
      {/* GRID OVERLAY */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-md p-8 border border-white/10 bg-black/50 backdrop-blur-xl">
        <header className="mb-10 space-y-2 text-center">
          <h1 className="text-2xl font-black uppercase italic tracking-[0.4em]">Auth_Required</h1>
          <p className="text-[10px] font-black text-[#d4ff3f] uppercase tracking-widest">{status}</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">User_ID</label>
            <input 
              required
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black outline-none focus:border-[#d4ff3f] transition-all uppercase italic"
              placeholder="ENTER_ID"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-white/30 tracking-widest">Access_Key</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black outline-none focus:border-[#d4ff3f] transition-all uppercase italic"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-[#d4ff3f] text-black py-5 text-[11px] font-black uppercase tracking-[0.5em] italic hover:bg-white transition-all">
            Initialize_Link
          </button>
        </form>
      </div>
      
      <div className="absolute bottom-10 text-[8px] font-black text-white/10 tracking-[1em] uppercase">
        Character Is Everything You Need
      </div>
    </main>
  );
}