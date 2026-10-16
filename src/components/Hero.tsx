import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Box, Image as ImageIcon, Flame, Gauge, Zap } from 'lucide-react';
import { ThreeCarViewer } from './ThreeCarViewer';

interface HeroProps {
  onExploreClick: () => void;
  onOpenTestDrive: () => void;
}

const TYPING_PHRASES = [
  'Precision in every curve.',
  'Power without compromise.',
  'Born to move you.',
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenTestDrive }) => {
  // Live typing animation state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // View mode: 3D interactive model vs Cinematic photography
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');

  // Mouse parallax for photography mode
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < currentPhrase.length) {
      // Typing
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
      }, 70);
    } else if (!isDeleting && displayText.length === currentPhrase.length) {
      // Pause at full phrase
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2600);
    } else if (isDeleting && displayText.length > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length - 1));
      }, 35);
    } else if (isDeleting && displayText.length === 0) {
      // Move to next phrase
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Mouse move handler for photographic parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'photo') return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 15;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden bg-[#07080c] flex items-center justify-center pt-16"
      id="hero"
    >
      {/* Background Layer: 3D Interactive Canvas OR Photographic Studio */}
      <div className="absolute inset-0 z-0">
        {viewMode === '3d' ? (
          <ThreeCarViewer initialColor="#0a0a0c" interactive={true} />
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src="/src/assets/images/hero_hypercar_obsidian_1792160358191.jpg"
              alt="Velocity Apex Valkyrie Hypercar in Dark Studio"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 ease-out scale-105"
              style={{
                transform: `scale(1.08) translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`,
              }}
            />
            {/* Cinematic Gradient Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-[#090a0f]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f]/80 via-transparent to-[#090a0f]/80" />
            <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(9,10,15,0.7)_80%]" />
          </div>
        )}
      </div>

      {/* Atmospheric Overlays */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#090a0f] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/80 to-transparent pointer-events-none z-10" />

      {/* Interactive Mode Switcher (Top Right Pill) */}
      <div className="absolute top-24 right-6 sm:right-10 z-20 flex items-center bg-[#10131c]/90 border border-white/10 rounded-full p-1 backdrop-blur-md">
        <button
          onClick={() => setViewMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all rounded-full cursor-pointer ${
            viewMode === '3d'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Interactive 3D</span>
        </button>
        <button
          onClick={() => setViewMode('photo')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all rounded-full cursor-pointer ${
            viewMode === 'photo'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Cinematic Cam</span>
        </button>
      </div>

      {/* Hero Typography & Content Overlay (Pointer-events none on wrapper, active on buttons) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-between py-12 pointer-events-none">
        {/* Top Kicker & Live Status */}
        <div className="pt-6 sm:pt-10">
          <div className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-slate-400 font-mono">
            <span className="text-red-500 font-bold">01 // THE PINNACLE OF AUTOMOTIVE ARTISTRY</span>
            <span className="text-white/20">|</span>
            <span className="text-slate-300">VELOCITY V12 HYBRID SERIES</span>
          </div>
        </div>

        {/* Center / Lower Main Typography */}
        <div className="max-w-3xl space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[0.92] drop-shadow-2xl">
            ENGINEERED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-red-500">
              TO EXCITE
            </span>
          </h1>

          {/* Typing Animation Subtitle with Blinking Cursor */}
          <div className="h-10 sm:h-12 flex items-center">
            <p className="text-lg sm:text-2xl text-slate-200 font-light tracking-wide flex items-center">
              <span>{displayText}</span>
              <span
                className={`inline-block w-0.5 h-6 sm:h-7 ml-1 bg-red-500 transition-opacity ${
                  cursorVisible ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 pointer-events-auto">
            <button
              onClick={onExploreClick}
              className="px-8 py-3.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-600/30 flex items-center gap-3 group cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
            <button
              onClick={onOpenTestDrive}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-semibold text-xs uppercase tracking-widest border border-white/20 transition-all backdrop-blur-sm cursor-pointer"
            >
              <span>Reserve VIP Viewing</span>
            </button>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-6 grid grid-cols-3 gap-6 sm:gap-10 border-t border-white/10 max-w-lg">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white tabular-nums">
                1,180 <span className="text-xs text-red-500 font-normal">HP</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Max Output
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white tabular-nums">
                2.1 <span className="text-xs text-red-500 font-normal">SEC</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                0-100 KM/H
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white tabular-nums">
                402 <span className="text-xs text-red-500 font-normal">KM/H</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Top Speed
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="flex justify-center pb-2 pointer-events-auto">
          <button
            onClick={onExploreClick}
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Discover</span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-red-500 rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
