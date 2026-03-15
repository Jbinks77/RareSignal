"use client";

export function PokeballLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08080E]">
      {/* CSS Pokeball */}
      <div className="relative w-24 h-24 mb-8 animate-bounce">
        {/* Top half - red */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#E53935] rounded-t-full" />
        {/* Bottom half - white */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-b-full" />
        {/* Center band */}
        <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 bg-[#1A1A2E] z-10" />
        {/* Center button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1A1A2E] z-20 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-[#D4AF58] shadow-[0_0_15px_rgba(212,175,88,0.5)] animate-pulse" />
        </div>
        {/* Shine effect */}
        <div className="absolute top-2 left-4 w-4 h-6 bg-white/20 rounded-full rotate-[-30deg] blur-[1px]" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-[#D4AF58] font-bold tracking-widest text-lg">RARESIGNAL</span>
        <span className="text-[10px] text-white/30 tracking-[0.3em]">MARKET INTELLIGENCE</span>
      </div>

      {/* Loading bar */}
      <div className="mt-6 w-32 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(to right, #D4AF58, #8A5CF6)",
            animation: "loadbar 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes loadbar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 100%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
