import React, { useState } from 'react';
import { Car } from '../types/car';
import { CARS } from '../data/cars';
import { X, CheckCircle, Calendar, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCar?: Car | null;
}

const SHOWROOMS = [
  'Monaco · Port Hercule Atelier',
  'London · Mayfair Flagship Pavilion',
  'Zurich · Bahnhofstrasse Atelier',
  'Tokyo · Ginza Sky Salon',
  'Beverly Hills · Wilshire Boulevard',
];

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  preselectedCar,
}) => {
  const [selectedCarId, setSelectedCarId] = useState<string>(
    preselectedCar?.id || CARS[0].id
  );
  const [showroom, setShowroom] = useState<string>(SHOWROOMS[0]);
  const [experienceType, setExperienceType] = useState<string>('Circuit Track Experience');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const code = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmationCode(code);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  const chosenCar = CARS.find((c) => c.id === selectedCarId) || CARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-[#0e111a] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0d14]">
          <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest">
            <span>VIP ATELIER RESERVATION</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation Success View */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-heading font-black text-white uppercase tracking-wide">
              RESERVATION CONFIRMED
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your private session for the <strong className="text-white">{chosenCar.brand} {chosenCar.model}</strong> has been logged with our Concierge team at <strong className="text-white">{showroom}</strong>.
            </p>

            <div className="p-4 bg-black/50 rounded-xl border border-white/10 inline-block font-mono text-xs text-slate-300">
              Booking Dossier: <span className="text-red-400 font-bold tracking-widest">{confirmationCode}</span>
            </div>

            <p className="text-[11px] font-mono text-slate-400">
              A private liaison will contact you within 4 hours to finalize security credentials and paddock scheduling.
            </p>

            <button
              onClick={handleResetAndClose}
              className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              Return to Showroom
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <p className="text-xs text-slate-300">
              Experience the pinnacle of automotive kinetics in an exclusive closed environment accompanied by an engineering test pilot.
            </p>

            {/* Selected Vehicle */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Requested Vehicle:
              </label>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="w-full bg-[#141824] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-red-500"
              >
                {CARS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#10131c] text-white">
                    {c.brand} {c.model} · {c.specs.horsepower} HP ({c.formattedPrice})
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Type */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExperienceType('Circuit Track Experience')}
                className={`p-2.5 text-[11px] font-mono uppercase tracking-wider rounded-lg border text-center transition-colors cursor-pointer ${
                  experienceType === 'Circuit Track Experience'
                    ? 'bg-red-600/30 text-white border-red-500'
                    : 'bg-[#141824] text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                Circuit Track Drive
              </button>
              <button
                type="button"
                onClick={() => setExperienceType('Private Atelier Consultation')}
                className={`p-2.5 text-[11px] font-mono uppercase tracking-wider rounded-lg border text-center transition-colors cursor-pointer ${
                  experienceType === 'Private Atelier Consultation'
                    ? 'bg-red-600/30 text-white border-red-500'
                    : 'bg-[#141824] text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                Atelier Spec Session
              </button>
            </div>

            {/* Showroom Location */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Preferred Showroom Atelier:
              </label>
              <select
                value={showroom}
                onChange={(e) => setShowroom(e.target.value)}
                className="w-full bg-[#141824] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-red-500"
              >
                {SHOWROOMS.map((loc) => (
                  <option key={loc} value={loc} className="bg-[#10131c] text-white">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lord Sterling Vance"
                  className="w-full bg-[#141824] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Private Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vance@atelier-holdings.com"
                  className="w-full bg-[#141824] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Direct Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 20 7946 0912"
                  className="w-full bg-[#141824] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#141824] border border-white/15 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-slate-400">
              <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
              <span>Strict FIA / Supercar manufacturer security protocols maintained.</span>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer rounded-sm"
            >
              <span>Transmit VIP Reservation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
