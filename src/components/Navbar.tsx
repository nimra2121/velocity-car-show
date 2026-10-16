import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenTestDrive: () => void;
  activeCompareCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTestDrive, activeCompareCount = 0 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090a0f]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-[#090a0f]/90 via-[#090a0f]/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Single element brand wordmark */}
          <a href="#" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
            <div className="w-2.5 h-6 bg-red-600 skew-x-[-18deg] group-hover:bg-red-500 transition-colors" />
            <span className="font-heading text-2xl sm:text-3xl font-bold tracking-wider text-white uppercase">
              VELOCITY
            </span>
          </a>

          {/* Zone 2: Clean 4–5 single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-slate-300">
            <a
              href="#collection"
              className="hover:text-white transition-colors relative py-1 hover:border-b-2 hover:border-red-600 whitespace-nowrap shrink-0"
            >
              Collection
            </a>
            <a
              href="#studio3d"
              className="hover:text-white transition-colors relative py-1 hover:border-b-2 hover:border-red-600 whitespace-nowrap shrink-0"
            >
              3D Studio
            </a>
            <a
              href="#compare"
              className="hover:text-white transition-colors relative py-1 hover:border-b-2 hover:border-red-600 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Compare Garage</span>
              {activeCompareCount > 0 && (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-red-600 text-white rounded">
                  {activeCompareCount}
                </span>
              )}
            </a>
            <a
              href="#engineering"
              className="hover:text-white transition-colors relative py-1 hover:border-b-2 hover:border-red-600 whitespace-nowrap shrink-0"
            >
              Engineering
            </a>
            <a
              href="#gallery"
              className="hover:text-white transition-colors relative py-1 hover:border-b-2 hover:border-red-600 whitespace-nowrap shrink-0"
            >
              Gallery
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onOpenTestDrive}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all shadow-lg shadow-red-600/30 whitespace-nowrap shrink-0 cursor-pointer rounded-sm"
            >
              <span>Reserve Viewing</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0e14]/98 border-b border-white/10 px-6 py-6 space-y-4">
          <a
            href="#collection"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-red-500 py-1"
          >
            Collection
          </a>
          <a
            href="#studio3d"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-red-500 py-1"
          >
            3D Studio
          </a>
          <a
            href="#compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-red-500 py-1"
          >
            Compare Garage ({activeCompareCount})
          </a>
          <a
            href="#engineering"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-red-500 py-1"
          >
            Engineering
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-200 hover:text-red-500 py-1"
          >
            Gallery
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTestDrive();
            }}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold tracking-wider uppercase text-white bg-red-600 hover:bg-red-700 transition-colors rounded-sm"
          >
            <span>Reserve Viewing</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
