/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CARS } from './data/cars';
import { Car } from './types/car';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CarCollection } from './components/CarCollection';
import { Studio3DSection } from './components/Studio3DSection';
import { CompareGarage } from './components/CompareGarage';
import { BrandStory } from './components/BrandStory';
import { GallerySection } from './components/GallerySection';
import { CarDetailModal } from './components/CarDetailModal';
import { TestDriveModal } from './components/TestDriveModal';
import { Footer } from './components/Footer';
import { ArrowLeftRight, Check, X } from 'lucide-react';

export default function App() {
  const [selectedCarForDetail, setSelectedCarForDetail] = useState<Car | null>(null);
  const [comparedCars, setComparedCars] = useState<Car[]>([CARS[0], CARS[1]]);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [testDrivePreselectedCar, setTestDrivePreselectedCar] = useState<Car | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const handleToggleCompare = (car: Car) => {
    const isAlreadyCompared = comparedCars.some((c) => c.id === car.id);

    if (isAlreadyCompared) {
      // Remove car
      setComparedCars((prev) => prev.filter((c) => c.id !== car.id));
      showToast(`Removed ${car.model} from Compare Garage`);
    } else {
      if (comparedCars.length >= 2) {
        // Replace second car
        setComparedCars([comparedCars[0], car]);
        showToast(`Replaced second slot with ${car.model}`);
      } else {
        setComparedCars([...comparedCars, car]);
        showToast(`Added ${car.model} to Compare Garage`);
      }
    }
  };

  const handleSelectCarToCompare = (slotIndex: 0 | 1, carId: string) => {
    const foundCar = CARS.find((c) => c.id === carId);
    if (!foundCar) return;

    setComparedCars((prev) => {
      const next = [...prev];
      next[slotIndex] = foundCar;
      return next;
    });
  };

  const handleOpenTestDrive = (car?: Car) => {
    setTestDrivePreselectedCar(car || null);
    setTestDriveModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-body relative overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpenTestDrive={() => handleOpenTestDrive()}
        activeCompareCount={comparedCars.length}
      />

      {/* Main Content */}
      <main>
        {/* 1. Cinematic Hero with 3D Studio & Photo Switcher */}
        <Hero
          onExploreClick={() => scrollToSection('collection')}
          onOpenTestDrive={() => handleOpenTestDrive(CARS[0])}
        />

        {/* 2. Curated Car Collection */}
        <CarCollection
          onSelectCar={(car) => setSelectedCarForDetail(car)}
          onToggleCompare={handleToggleCompare}
          comparedCarIds={comparedCars.map((c) => c.id)}
        />

        {/* 3. Interactive 3D Configurator Studio */}
        <Studio3DSection />

        {/* 4. Compare Garage */}
        <CompareGarage
          comparedCars={comparedCars}
          onSelectCarToCompare={handleSelectCarToCompare}
          onInspectCar={(car) => setSelectedCarForDetail(car)}
        />

        {/* 5. Brand Engineering Story & Performance Metrics */}
        <BrandStory />

        {/* 6. Automotive Atelier Gallery with Lightbox */}
        <GallerySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Car Detail Modal */}
      <CarDetailModal
        car={selectedCarForDetail}
        onClose={() => setSelectedCarForDetail(null)}
        onToggleCompare={handleToggleCompare}
        isCompared={selectedCarForDetail ? comparedCars.some((c) => c.id === selectedCarForDetail.id) : false}
        onBookTestDrive={(car) => {
          setSelectedCarForDetail(null);
          handleOpenTestDrive(car);
        }}
      />

      {/* Test Drive / Viewing Reservation Modal */}
      <TestDriveModal
        isOpen={testDriveModalOpen}
        onClose={() => setTestDriveModalOpen(false)}
        preselectedCar={testDrivePreselectedCar}
      />

      {/* Floating Compare Notification Bar */}
      {comparedCars.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-3 p-3 bg-[#111420]/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-white font-bold">{comparedCars.length} / 2</span>
            <span className="text-slate-400">Cars in Compare</span>
          </div>
          <button
            onClick={() => scrollToSection('compare')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>View Comparison</span>
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-black/90 text-white border border-red-500/40 rounded-lg shadow-2xl text-xs font-mono">
          <Check className="w-4 h-4 text-red-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
