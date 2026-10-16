import React, { useState } from 'react';
import { Car } from '../types/car';
import { CARS } from '../data/cars';
import { ArrowLeftRight, Check, Trophy, Sparkles, ChevronDown } from 'lucide-react';

interface CompareGarageProps {
  comparedCars: Car[];
  onSelectCarToCompare: (slotIndex: 0 | 1, carId: string) => void;
  onInspectCar: (car: Car) => void;
}

export const CompareGarage: React.FC<CompareGarageProps> = ({
  comparedCars,
  onSelectCarToCompare,
  onInspectCar,
}) => {
  // Ensure we always have two cars displayed (fall back to car 0 and car 1)
  const carA = comparedCars[0] || CARS[0];
  const carB = comparedCars[1] || CARS[1];

  // Metric calculation helpers
  const powerDiff = carA.specs.horsepower - carB.specs.horsepower;
  const accelDiff = carA.specs.acceleration - carB.specs.acceleration; // negative means A is faster
  const speedDiff = carA.specs.topSpeed - carB.specs.topSpeed;
  const torqueDiff = carA.specs.torque - carB.specs.torque;
  const weightDiff = carA.specs.weight - carB.specs.weight; // negative means A is lighter

  const ptwA = (carA.specs.horsepower / carA.specs.weight) * 1000;
  const ptwB = (carB.specs.horsepower / carB.specs.weight) * 1000;
  const ptwDiff = ptwA - ptwB;

  // Tally wins
  let winsA = 0;
  let winsB = 0;
  if (powerDiff > 0) winsA++; else if (powerDiff < 0) winsB++;
  if (accelDiff < 0) winsA++; else if (accelDiff > 0) winsB++;
  if (speedDiff > 0) winsA++; else if (speedDiff < 0) winsB++;
  if (torqueDiff > 0) winsA++; else if (torqueDiff < 0) winsB++;
  if (weightDiff < 0) winsA++; else if (weightDiff > 0) winsB++;
  if (ptwDiff > 0) winsA++; else if (ptwDiff < 0) winsB++;

  const handleSwap = () => {
    onSelectCarToCompare(0, carB.id);
    onSelectCarToCompare(1, carA.id);
  };

  return (
    <section id="compare" className="py-24 bg-[#0a0c12] border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest mb-2">
              <span>03</span>
              <span>/</span>
              <span>HEAD-TO-HEAD TELEMETRY</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
              COMPARE GARAGE
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Pitch engineering titans against each other across precision metrics: raw brake horsepower, telemetry acceleration curves, and power-to-weight ratios.
            </p>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="flex items-center gap-2 px-4 py-2 bg-[#141824] hover:bg-[#1a2030] text-slate-200 hover:text-white border border-white/10 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer self-start md:self-end"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-red-500" />
            <span>Swap Positions</span>
          </button>
        </div>

        {/* Vehicle Selection Cards Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Slot A */}
          <div className="bg-[#10141f] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {winsA > winsB && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-mono font-bold uppercase rounded-full">
                <Trophy className="w-3.5 h-3.5 text-red-400" />
                <span>Overall Lead ({winsA} Wins)</span>
              </div>
            )}

            <div>
              {/* Car Dropdown Picker */}
              <div className="mb-4">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Select Machine A:
                </label>
                <div className="relative">
                  <select
                    value={carA.id}
                    onChange={(e) => onSelectCarToCompare(0, e.target.value)}
                    className="w-full appearance-none bg-[#161a29] border border-white/15 rounded-lg px-4 py-2.5 text-sm font-semibold text-white outline-none cursor-pointer pr-10 focus:border-red-500"
                  >
                    {CARS.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#10141f] text-white">
                        {c.brand} {c.model} ({c.specs.horsepower} HP)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Photo Showcase */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/60 my-4 border border-white/10">
                <img
                  src={carA.image}
                  alt={carA.model}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4">
                  <div className="text-xl font-heading font-black text-white uppercase">{carA.model}</div>
                  <div className="text-xs font-mono text-red-400">{carA.formattedPrice}</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono mt-2 line-clamp-1">
                {carA.specs.engine}
              </div>
            </div>

            <button
              onClick={() => onInspectCar(carA)}
              className="mt-6 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              Inspect Vehicle A
            </button>
          </div>

          {/* Slot B */}
          <div className="bg-[#10141f] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {winsB > winsA && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-mono font-bold uppercase rounded-full">
                <Trophy className="w-3.5 h-3.5 text-red-400" />
                <span>Overall Lead ({winsB} Wins)</span>
              </div>
            )}

            <div>
              {/* Car Dropdown Picker */}
              <div className="mb-4">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Select Machine B:
                </label>
                <div className="relative">
                  <select
                    value={carB.id}
                    onChange={(e) => onSelectCarToCompare(1, e.target.value)}
                    className="w-full appearance-none bg-[#161a29] border border-white/15 rounded-lg px-4 py-2.5 text-sm font-semibold text-white outline-none cursor-pointer pr-10 focus:border-red-500"
                  >
                    {CARS.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#10141f] text-white">
                        {c.brand} {c.model} ({c.specs.horsepower} HP)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Photo Showcase */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/60 my-4 border border-white/10">
                <img
                  src={carB.image}
                  alt={carB.model}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4">
                  <div className="text-xl font-heading font-black text-white uppercase">{carB.model}</div>
                  <div className="text-xs font-mono text-red-400">{carB.formattedPrice}</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono mt-2 line-clamp-1">
                {carB.specs.engine}
              </div>
            </div>

            <button
              onClick={() => onInspectCar(carB)}
              className="mt-6 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              Inspect Vehicle B
            </button>
          </div>
        </div>

        {/* Comparative Spec Bars Table */}
        <div className="mt-12 bg-[#0e111a] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-8">
            Comparative Telemetry Benchmark
          </h3>

          <div className="space-y-6">
            {/* Metric 1: Horsepower */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={`font-bold tabular-nums ${carA.specs.horsepower >= carB.specs.horsepower ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {carA.specs.horsepower} HP
                </span>
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Engine Output</span>
                <span className={`font-bold tabular-nums ${carB.specs.horsepower >= carA.specs.horsepower ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {carB.specs.horsepower} HP
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 h-3 bg-black/50 rounded-full p-0.5">
                <div className="flex justify-end">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${carA.specs.horsepower >= carB.specs.horsepower ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.min(100, (carA.specs.horsepower / 2000) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-start">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${carB.specs.horsepower >= carA.specs.horsepower ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.min(100, (carB.specs.horsepower / 2000) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metric 2: 0-100 km/h (Lower is better) */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={`font-bold tabular-nums ${carA.specs.acceleration <= carB.specs.acceleration ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {carA.specs.acceleration}s {carA.specs.acceleration < carB.specs.acceleration && '⚡ Faster'}
                </span>
                <span className="text-slate-400 uppercase tracking-wider font-semibold">0-100 km/h Acceleration</span>
                <span className={`font-bold tabular-nums ${carB.specs.acceleration <= carA.specs.acceleration ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {carB.specs.acceleration < carA.specs.acceleration && '⚡ Faster '} {carB.specs.acceleration}s
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 h-3 bg-black/50 rounded-full p-0.5">
                <div className="flex justify-end">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${carA.specs.acceleration <= carB.specs.acceleration ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.max(20, (1 - (carA.specs.acceleration - 1.5) / 3.0) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-start">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${carB.specs.acceleration <= carA.specs.acceleration ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.max(20, (1 - (carB.specs.acceleration - 1.5) / 3.0) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metric 3: Top Speed */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={`font-bold tabular-nums ${carA.specs.topSpeed >= carB.specs.topSpeed ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {carA.specs.topSpeed} km/h
                </span>
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Maximum Velocity</span>
                <span className={`font-bold tabular-nums ${carB.specs.topSpeed >= carA.specs.topSpeed ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {carB.specs.topSpeed} km/h
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 h-3 bg-black/50 rounded-full p-0.5">
                <div className="flex justify-end">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${carA.specs.topSpeed >= carB.specs.topSpeed ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.min(100, (carA.specs.topSpeed / 450) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-start">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${carB.specs.topSpeed >= carA.specs.topSpeed ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.min(100, (carB.specs.topSpeed / 450) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metric 4: Torque */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={`font-bold tabular-nums ${carA.specs.torque >= carB.specs.torque ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {carA.specs.torque} Nm
                </span>
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Peak Torque</span>
                <span className={`font-bold tabular-nums ${carB.specs.torque >= carA.specs.torque ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {carB.specs.torque} Nm
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 h-3 bg-black/50 rounded-full p-0.5">
                <div className="flex justify-end">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${carA.specs.torque >= carB.specs.torque ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.min(100, (carA.specs.torque / 2500) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-start">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${carB.specs.torque >= carA.specs.torque ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.min(100, (carB.specs.torque / 2500) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metric 5: Power-to-weight */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={`font-bold tabular-nums ${ptwA >= ptwB ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {ptwA.toFixed(1)} HP/t
                </span>
                <span className="text-slate-400 uppercase tracking-wider font-semibold">Power-to-Weight Ratio</span>
                <span className={`font-bold tabular-nums ${ptwB >= ptwA ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                  {ptwB.toFixed(1)} HP/t
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 h-3 bg-black/50 rounded-full p-0.5">
                <div className="flex justify-end">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${ptwA >= ptwB ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.min(100, (ptwA / 1200) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-start">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${ptwB >= ptwA ? 'bg-red-600' : 'bg-slate-600'}`}
                    style={{ width: `${Math.min(100, (ptwB / 1200) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
