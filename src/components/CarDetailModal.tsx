import React, { useState, useEffect, useRef } from 'react';
import { Car } from '../types/car';
import { X, Volume2, VolumeX, Gauge, Zap, Flame, Shield, ArrowRight, Check, Plus, Sliders } from 'lucide-react';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  onToggleCompare: (car: Car) => void;
  isCompared: boolean;
  onBookTestDrive: (car: Car) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  onToggleCompare,
  isCompared,
  onBookTestDrive,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'powertrain' | 'chassis' | 'cockpit'>('powertrain');
  const [isRevving, setIsRevving] = useState<boolean>(false);
  const [rpm, setRpm] = useState<number>(1000);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Sync initial color
  useEffect(() => {
    if (car && car.colors.length > 0) {
      setSelectedColor(car.colors[0].hex);
    }
    setRpm(1000);
  }, [car]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Web Audio Procedural Engine Rev Synthesizer
  const startRevving = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      // Rev ramp up
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.1);

      // Low pass filter for engine roar depth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;

      setIsRevving(true);
      setRpm(8200);
    } catch {
      // AudioContext fallback
    }
  };

  const stopRevving = () => {
    setIsRevving(false);
    setRpm(1000);
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.4);
      setTimeout(() => {
        if (oscRef.current) {
          try {
            oscRef.current.stop();
            oscRef.current.disconnect();
          } catch {
            // ignore
          }
          oscRef.current = null;
        }
      }, 450);
    }
  };

  if (!car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-5xl bg-[#0d1017] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090b10]">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-red-500 font-semibold">{car.brand}</span>
            <span>·</span>
            <span>{car.category} SPECIFICATION</span>
            <span>·</span>
            <span className="text-white">{car.year} Homologation</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Visual Showcase & Audio Engine Rev */}
          <div className="lg:col-span-7 bg-[#07090d] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            <div>
              {/* Car Image with Selected Color Rim Glow */}
              <div
                className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border transition-all duration-300"
                style={{ borderColor: selectedColor || 'rgba(255,255,255,0.1)' }}
              >
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-wide uppercase">
                      {car.model}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{car.tagline}</p>
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-bold text-white tabular-nums">
                    {car.formattedPrice}
                  </div>
                </div>
              </div>

              {/* Bespoke Exterior Palette Switcher */}
              <div className="mt-5 p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Available Exterior Finishes:
                </span>
                <div className="flex items-center gap-2">
                  {car.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.hex)}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                        selectedColor === c.hex ? 'border-white scale-125 shadow-lg shadow-white/30' : 'border-white/20 hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Engine Rev Acoustic Synthesizer (Interactive Web Audio) */}
              <div className="mt-4 p-4 bg-gradient-to-r from-red-950/20 via-black/40 to-black/40 rounded-xl border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                      Powertrain Acoustic Simulator
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      RPM: <span className="text-red-400 font-bold tabular-nums">{rpm}</span> / 9,000
                    </div>
                  </div>
                </div>

                <button
                  onMouseDown={startRevving}
                  onMouseUp={stopRevving}
                  onTouchStart={startRevving}
                  onTouchEnd={stopRevving}
                  className={`px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg border transition-all cursor-pointer ${
                    isRevving
                      ? 'bg-red-600 text-white border-red-400 scale-95 shadow-lg shadow-red-600/50'
                      : 'bg-[#151922] text-slate-200 border-white/10 hover:border-red-500 hover:text-white'
                  }`}
                >
                  {isRevving ? 'Throttle Open!' : 'Hold to Rev Engine'}
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 mt-6 leading-relaxed">
              {car.description}
            </p>
          </div>

          {/* Right Column: Deep Specifications & Action Dock */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Specification Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setActiveTab('powertrain')}
                  className={`text-xs font-semibold uppercase tracking-wider py-1 cursor-pointer transition-colors ${
                    activeTab === 'powertrain' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Powertrain
                </button>
                <button
                  onClick={() => setActiveTab('chassis')}
                  className={`text-xs font-semibold uppercase tracking-wider py-1 cursor-pointer transition-colors ${
                    activeTab === 'chassis' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Aero & Chassis
                </button>
                <button
                  onClick={() => setActiveTab('cockpit')}
                  className={`text-xs font-semibold uppercase tracking-wider py-1 cursor-pointer transition-colors ${
                    activeTab === 'cockpit' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Highlights
                </button>
              </div>

              {/* Tab 1: Powertrain & Telemetry */}
              {activeTab === 'powertrain' && (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Peak Horsepower</span>
                    <span className="text-sm font-display font-bold text-white tabular-nums">
                      {car.specs.horsepower} HP
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">0-100 km/h Sprint</span>
                    <span className="text-sm font-display font-bold text-red-400 tabular-nums">
                      {car.specs.acceleration} seconds
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Maximum Velocity</span>
                    <span className="text-sm font-display font-bold text-white tabular-nums">
                      {car.specs.topSpeed} km/h
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Peak Torque</span>
                    <span className="text-sm font-display font-bold text-white tabular-nums">
                      {car.specs.torque} Nm
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Transmission</span>
                    <span className="text-xs font-mono text-slate-200 text-right max-w-[200px]">
                      {car.specs.transmission}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Power Unit</span>
                    <span className="text-xs font-mono text-slate-200 text-right max-w-[200px]">
                      {car.specs.engine}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Chassis & Dynamics */}
              {activeTab === 'chassis' && (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Kerb Weight</span>
                    <span className="text-sm font-display font-bold text-white tabular-nums">
                      {car.specs.weight} kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Drivetrain</span>
                    <span className="text-xs font-mono text-slate-200">{car.specs.drivetrain}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Drag Coefficient (Cd)</span>
                    <span className="text-sm font-display font-bold text-white tabular-nums">
                      {car.specs.dragCoefficient}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Power-to-Weight</span>
                    <span className="text-sm font-display font-bold text-red-400 tabular-nums">
                      {((car.specs.horsepower / car.specs.weight) * 1000).toFixed(1)} HP / ton
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-slate-400">Fuel / Power Architecture</span>
                    <span className="text-xs font-mono text-slate-200 text-right max-w-[200px]">
                      {car.specs.fuelType}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 3: Highlights & Engineering */}
              {activeTab === 'cockpit' && (
                <div className="mt-5 space-y-2.5">
                  {car.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-start gap-3"
                    >
                      <span className="text-red-500 font-mono text-xs font-bold shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <span className="text-xs text-slate-200 leading-relaxed">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Dock */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <button
                onClick={() => onBookTestDrive(car)}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer rounded-sm"
              >
                <span>Book VIP Test Drive / Viewing</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleCompare(car)}
                className={`w-full py-3 text-xs font-semibold uppercase tracking-wider border transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-sm ${
                  isCompared
                    ? 'bg-white/10 text-white border-white/30'
                    : 'bg-transparent text-slate-300 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {isCompared ? <Check className="w-4 h-4 text-red-500" /> : <Plus className="w-4 h-4" />}
                <span>{isCompared ? 'Remove from Compare Garage' : 'Add to Compare Garage'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
