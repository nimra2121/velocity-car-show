import React, { useState, useRef } from 'react';
import { Car } from '../types/car';
import { Gauge, Zap, Flame, Plus, Check, ArrowRight } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  isCompared: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onSelect,
  onToggleCompare,
  isCompared,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7; // tilt max 7deg
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="group relative bg-[#10131c] border border-white/10 hover:border-red-500/50 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between transition-colors duration-300"
    >
      {/* Glare effect overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
          opacity: glare.opacity,
        }}
      />

      {/* Top Image Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0a0c12]">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Fallback loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0c0f17]">
            <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
          </div>
        )}

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10131c] via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges: Brand & Category (Clean metadata) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono tracking-wider">
            <span className="font-semibold text-white">{car.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{car.category}</span>
          </div>

          {/* Compare Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(car);
            }}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare Garage'}
            className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase rounded transition-colors cursor-pointer ${
              isCompared
                ? 'bg-red-600 text-white'
                : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 border border-white/10'
            }`}
          >
            {isCompared ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            <span>{isCompared ? 'Compared' : 'Compare'}</span>
          </button>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-4">
          <div className="text-xl font-heading font-bold text-white tracking-wide">
            {car.formattedPrice}
          </div>
        </div>
      </div>

      {/* Card Body & Technical Specs */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-heading font-bold text-white tracking-wide uppercase group-hover:text-red-500 transition-colors">
            {car.model}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {car.tagline}
          </p>

          {/* Engine Spec Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono text-slate-300 line-clamp-1">
            {car.specs.engine}
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-black/40 rounded-lg border border-white/5">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Power</div>
              <div className="text-base font-display font-bold text-white tabular-nums">
                {car.specs.horsepower} <span className="text-[10px] text-red-500">HP</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">0-100 km/h</div>
              <div className="text-base font-display font-bold text-white tabular-nums">
                {car.specs.acceleration}s
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Top Speed</div>
              <div className="text-base font-display font-bold text-white tabular-nums">
                {car.specs.topSpeed} <span className="text-[10px] text-slate-400">km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {car.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {car.colors.length > 3 && (
              <span className="text-[10px] font-mono text-slate-500">
                +{car.colors.length - 3}
              </span>
            )}
          </div>

          <button
            onClick={() => onSelect(car)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white group-hover:text-red-500 transition-colors cursor-pointer"
          >
            <span>Inspect Spec</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
