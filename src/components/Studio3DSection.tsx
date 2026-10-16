import React from 'react';
import { ThreeCarViewer } from './ThreeCarViewer';
import { Box, Sparkles, Sliders } from 'lucide-react';

export const Studio3DSection: React.FC = () => {
  return (
    <section id="studio3d" className="py-24 bg-[#07080d] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest mb-2">
              <span>06</span>
              <span>/</span>
              <span>REAL-TIME GRAPHICS ENGINE</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
              INTERACTIVE 3D ATELIER
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Inspect the aerodynamic carbon sculpting in real-time WebGL with physically based rendering (PBR), studio reflection probes, and customizable paint finishes.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#121520] px-4 py-2 rounded-lg border border-white/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>WebGL 2.0 PBR Shaders Active</span>
          </div>
        </div>
      </div>

      {/* Full-bleed 3D Canvas Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[620px] w-full rounded-2xl overflow-hidden border border-white/15 bg-[#090b10] shadow-2xl relative">
          <ThreeCarViewer initialColor="#0a0a0c" interactive={true} />
        </div>
      </div>
    </section>
  );
};
