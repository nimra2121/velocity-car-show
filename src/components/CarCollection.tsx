import React, { useState, useMemo } from 'react';
import { Car, CarCategory } from '../types/car';
import { CARS } from '../data/cars';
import { CarCard } from './CarCard';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface CarCollectionProps {
  onSelectCar: (car: Car) => void;
  onToggleCompare: (car: Car) => void;
  comparedCarIds: string[];
}

const CATEGORIES: ('All' | CarCategory)[] = ['All', 'Sports', 'Luxury', 'SUV', 'Electric'];

type SortOption = 'featured' | 'power-desc' | 'accel-asc' | 'price-asc' | 'price-desc';

export const CarCollection: React.FC<CarCollectionProps> = ({
  onSelectCar,
  onToggleCompare,
  comparedCarIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | CarCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Filter & sort logic
  const filteredCars = useMemo(() => {
    let result = [...CARS];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((car) => car.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (car) =>
          car.brand.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.specs.engine.toLowerCase().includes(q) ||
          car.tagline.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'power-desc':
        result.sort((a, b) => b.specs.horsepower - a.specs.horsepower);
        break;
      case 'accel-asc':
        result.sort((a, b) => a.specs.acceleration - b.specs.acceleration);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // featured default
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleReset = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="collection" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest mb-2">
            <span>02</span>
            <span>/</span>
            <span>CURATED SHOWROOM</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
            THE VELOCITY STABLE
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Each machine represents an uncompromising union of aerodynamic sculpturing, bespoke coachbuilding, and relentless physical momentum.
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-white font-bold text-lg tabular-nums">
            {filteredCars.length}
          </span>
          <span>of {CARS.length} Vehicles Available</span>
        </div>
      </div>

      {/* Control Bar: Category Tabs & Search & Sort */}
      <div className="mt-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Interactive Filter Tabs (Strict UI rule: functional segmented controls) */}
        <div className="flex items-center gap-1 p-1 bg-[#12151f] rounded-lg border border-white/10 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-md transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Area */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, V8, V12, EV..."
              className="w-full pl-9 pr-4 py-2 bg-[#12151f] border border-white/10 focus:border-red-500 rounded-lg text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-[#12151f] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-white outline-none cursor-pointer pr-2"
            >
              <option value="featured" className="bg-[#10131c] text-white">Sort: Featured</option>
              <option value="power-desc" className="bg-[#10131c] text-white">Power: High to Low</option>
              <option value="accel-asc" className="bg-[#10131c] text-white">0-100: Fastest</option>
              <option value="price-desc" className="bg-[#10131c] text-white">Price: High to Low</option>
              <option value="price-asc" className="bg-[#10131c] text-white">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      {filteredCars.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onSelect={onSelectCar}
              onToggleCompare={onToggleCompare}
              isCompared={comparedCarIds.includes(car.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-16 py-16 text-center border border-dashed border-white/10 rounded-xl bg-[#0e1119]">
          <p className="text-slate-400 text-sm">No vehicles matched your current filter criteria.</p>
          <button
            onClick={handleReset}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors hover:bg-red-700 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </section>
  );
};
