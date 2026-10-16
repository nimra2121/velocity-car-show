import React, { useState } from 'react';
import { CARS } from '../data/cars';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const galleryItems = CARS.map((car) => ({
    title: `${car.brand} ${car.model}`,
    subtitle: car.tagline,
    image: car.image,
    category: car.category,
    specs: `${car.specs.horsepower} HP · ${car.specs.topSpeed} km/h`,
  }));

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % galleryItems.length);
    }
  };

  const prevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#07080c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest mb-2">
              <span>05</span>
              <span>/</span>
              <span>AUTOMOTIVE ATELIER GALLERY</span>
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
              STUDIO PORTFOLIO
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              High-resolution captures examining sculpted titanium exhausts, carbon diffuser aerodynamics, and dramatic studio chiaroscuro.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Click any frame for full-screen inspection
          </div>
        </div>

        {/* Masonry / Bento-Style Gallery Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className={`group relative rounded-xl overflow-hidden cursor-pointer bg-[#0e111a] border border-white/10 hover:border-red-500/50 transition-all duration-300 ${
                idx === 0 || idx === 5 ? 'sm:col-span-2 sm:row-span-2 aspect-[16/10]' : 'aspect-square'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex justify-end">
                  <div className="p-2 rounded-full bg-black/60 text-slate-300 group-hover:text-white group-hover:bg-red-600 transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                    {item.category}
                  </div>
                  <h4 className="text-lg font-heading font-bold text-white uppercase mt-0.5">
                    {item.title}
                  </h4>
                  <div className="text-xs font-mono text-slate-300 mt-1">
                    {item.specs}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-50"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer z-50"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Image Container */}
          <div
            className="max-w-6xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-2xl max-h-[75vh]">
              <img
                src={galleryItems[activeLightboxIndex].image}
                alt={galleryItems[activeLightboxIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-heading font-black text-white uppercase">
                {galleryItems[activeLightboxIndex].title}
              </h3>
              <p className="text-xs font-mono text-red-400 mt-1">
                {galleryItems[activeLightboxIndex].specs} · {galleryItems[activeLightboxIndex].subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
