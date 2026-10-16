import React from 'react';
import { Wind, Shield, Cpu, Activity, Compass, Award } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="engineering" className="py-24 bg-[#08090d] text-slate-100 relative overflow-hidden">
      {/* Subtle background red sweep */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest mb-2">
            <span>04</span>
            <span>/</span>
            <span>THE VELOCITY DOCTRINE</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-[0.95]">
            WHERE AERODYNAMICS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">
              BECOMES ART
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
            We reject the notion that high-performance vehicles must conform to sterile algorithmic templates. Every curve is carved by the wind, sculpted in carbon, and calibrated to ignite the driver's deepest sensory instincts.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0f121b] border border-white/10 hover:border-red-500/40 p-6 rounded-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase">Architecture 01</div>
            <h3 className="text-lg font-heading font-bold text-white uppercase mt-1">
              Carbon Monocoque
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Formed from aerospace autoclave prepreg carbon fiber. Achieving a torsional stiffness exceeding 65,000 Nm/degree while shedding over 200 kg against conventional aluminum structures.
            </p>
          </div>

          <div className="bg-[#0f121b] border border-white/10 hover:border-red-500/40 p-6 rounded-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-6">
              <Wind className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase">Architecture 02</div>
            <h3 className="text-lg font-heading font-bold text-white uppercase mt-1">
              Active Ground Effect
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Underbody Venturi tunnels generate 1,800 kg of suction downforce at 250 km/h without protruding aero drag, suctioning the chassis into apexes with zero body roll.
            </p>
          </div>

          <div className="bg-[#0f121b] border border-white/10 hover:border-red-500/40 p-6 rounded-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase">Architecture 03</div>
            <h3 className="text-lg font-heading font-bold text-white uppercase mt-1">
              Silicon Carbide Inverters
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Switching at 100 kHz with 99.2% electrical efficiency. Modulating torque distribution to each independent wheel assembly within 2 milliseconds.
            </p>
          </div>

          <div className="bg-[#0f121b] border border-white/10 hover:border-red-500/40 p-6 rounded-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase">Architecture 04</div>
            <h3 className="text-lg font-heading font-bold text-white uppercase mt-1">
              Inconel Acoustics
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Hand-welded 0.7mm wall thickness Inconel 625 manifolds produce an exhilarating high-frequency F1 acoustic signature revving to 9,000 RPM.
            </p>
          </div>
        </div>

        {/* Performance Statistics Strip (Claim to Proof Adjacency) */}
        <div className="mt-16 bg-[#10141f] border border-white/10 rounded-2xl p-8 lg:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-4 md:pt-0">
              <div className="font-heading text-4xl sm:text-5xl font-black text-white tabular-nums">
                0.22 <span className="text-sm text-red-500">Cd</span>
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
                Drag Coefficient
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="font-heading text-4xl sm:text-5xl font-black text-white tabular-nums">
                1.74 <span className="text-sm text-red-500">s</span>
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
                0-100 km/h Record
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="font-heading text-4xl sm:text-5xl font-black text-white tabular-nums">
                1,800 <span className="text-sm text-red-500">kg</span>
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
                Aero Downforce
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="font-heading text-4xl sm:text-5xl font-black text-white tabular-nums">
                100<span className="text-sm text-red-500">%</span>
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
                Autoclave Carbon Monocoque
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
