import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#050609] border-t border-white/10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-red-600 skew-x-[-18deg]" />
              <span className="font-heading text-2xl font-bold tracking-wider text-white uppercase">
                VELOCITY
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              The art of driving elevated to its purest kinetic form. High-performance aerodynamics, motorsport carbon engineering, and bespoke coachbuilding.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500">
              © {new Date().getFullYear()} VELOCITY AUTOMOTIVE ATELIER AG. ALL RIGHTS RESERVED.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Cinematic Hero
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  Vehicle Collection
                </a>
              </li>
              <li>
                <a href="#studio3d" className="hover:text-white transition-colors">
                  Interactive 3D Studio
                </a>
              </li>
              <li>
                <a href="#compare" className="hover:text-white transition-colors">
                  Compare Garage
                </a>
              </li>
              <li>
                <a href="#engineering" className="hover:text-white transition-colors">
                  Engineering Doctrine
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Atelier Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Showroom Pavilions */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Global Ateliers
            </h4>
            <ul className="space-y-2 font-mono text-[11px] text-slate-400">
              <li>Monaco · Quai Antoine 1er</li>
              <li>London · 14 Berkeley Square, Mayfair</li>
              <li>Zurich · Bahnhofstrasse 48</li>
              <li>Tokyo · 6-10-1 Roppongi Hills</li>
              <li>Los Angeles · Beverly Hills Atelier</li>
            </ul>
          </div>

          {/* Newsletter / Velocity Journal */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              The Velocity Journal
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated telemetry insights, private track day invitations, and limited allocation announcements.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 bg-red-950/30 border border-red-500/30 rounded text-red-300 font-mono text-xs">
                <Check className="w-4 h-4 text-red-500" />
                <span>Subscription Confirmed</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter executive email..."
                    className="w-full bg-[#10141f] border border-white/10 rounded-l px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-red-600 hover:bg-red-700 text-white rounded-r transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Private communication. Unsubscribe at any time.
                </span>
              </form>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
