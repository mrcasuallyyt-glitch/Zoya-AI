import React from "react";
import { Sparkles, Shield, Heart } from "lucide-react";

export default function AdBanner160x300() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 w-full max-w-[190px] mx-auto shadow-xl backdrop-blur-md">
      <span className="text-[10px] text-white/40 tracking-wider uppercase font-mono">Zoya Premium Offer</span>
      <div 
        className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-gradient-to-b from-[#110C24] via-[#0E071A] to-[#040108] p-4 flex flex-col justify-between border border-violet-500/20 shadow-inner relative group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="space-y-4 relative z-10">
          <div className="flex justify-center">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/30 animate-pulse">
              <Sparkles className="text-amber-400" size={20} />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h5 className="text-[13px] font-bold font-serif text-white tracking-wide">Zoya Pro</h5>
            <p className="text-[9px] text-violet-200/70 leading-normal">
              Unlock super-fast responses & ultra-realistic voice models!
            </p>
          </div>
        </div>

        <div className="space-y-3.5 relative z-10">
          <div className="flex flex-col gap-1.5 text-[8px] text-white/60 font-medium">
            <div className="flex items-center gap-1">
              <Shield size={10} className="text-emerald-400 shrink-0" />
              <span>Ad-Free Experience</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={10} className="text-pink-400 shrink-0" />
              <span>Priority Live Voice</span>
            </div>
          </div>

          <button 
            type="button"
            className="w-full py-2 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 active:scale-95 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer border border-white/10"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
