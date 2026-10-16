import { Car } from '../types/car';

export const CARS: Car[] = [
  {
    id: 'valkyrie-apex',
    brand: 'VELOCITY',
    model: 'Apex Valkyrie 01',
    tagline: 'Track-bred aerodynamic supremacy with road compliance',
    category: 'Sports',
    price: 3450000,
    formattedPrice: '$3,450,000',
    image: '/src/assets/images/hero_hypercar_obsidian_1792160358191.jpg',
    year: 2026,
    description: 'The definitive physical manifestation of extreme aerodynamics and unfiltered combustion. Built around a bespoke 100% dry carbon monocoque chassis generating over 1,800 kg of downforce at track speeds.',
    highlights: [
      'Active Venturi underfloor tunnels with integrated DRS',
      'Inconel Formula-derived tuned exhaust manifolds',
      'Forged magnesium center-lock aero turbine wheels',
      'Telemetry data logging with 60Hz telemetry uplink'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0a0a0c' },
      { name: 'Apex Crimson', hex: '#b91c1c' },
      { name: 'Forged Slate', hex: '#334155' },
      { name: 'Ghost Silver', hex: '#cbd5e1' }
    ],
    specs: {
      horsepower: 1180,
      engine: '6.5L Naturally Aspirated V12 + KERS Hybrid',
      displacement: '6,498 cc',
      transmission: '7-Speed Single-Clutch Sequential Dog-Ring',
      acceleration: 2.1,
      topSpeed: 402,
      torque: 950,
      weight: 1130,
      drivetrain: 'Rear-Wheel Drive (RWD)',
      fuelType: 'Hybrid 98 RON High Octane',
      dragCoefficient: 0.31
    }
  },
  {
    id: 'scuderia-furia',
    brand: 'FURIA',
    model: 'Furia 820 Stradale',
    tagline: 'Passionate Italian engineering, sculpted by wind and instinct',
    category: 'Sports',
    price: 480000,
    formattedPrice: '$480,000',
    image: '/src/assets/images/car_hypercar_red_1792160357622.jpg',
    year: 2026,
    description: 'A visceral tribute to mid-engine Italian motorsport heritage. Featuring twin twin-scroll turbochargers feeding into a flat-plane crankshaft that screams all the way to an intoxicating 8,500 RPM.',
    highlights: [
      'Flat-plane crankshaft with zero-lag twin titanium turbines',
      'Side slip control 7.0 dynamic vectoring differential',
      'Carbon-ceramic Brembo CCM-R 398mm brake discs',
      'Alcantara racing buckets with 4-point harness mounts'
    ],
    colors: [
      { name: 'Rosso Corsa Red', hex: '#dc2626' },
      { name: 'Nero Nocturne', hex: '#111827' },
      { name: 'Giallo Modena', hex: '#eab308' },
      { name: 'Bianco Pearl', hex: '#f8fafc' }
    ],
    specs: {
      horsepower: 820,
      engine: '3.9L Twin-Turbo Flat-Plane V8',
      displacement: '3,902 cc',
      transmission: '8-Speed Dual-Clutch F1 Paddle Shift',
      acceleration: 2.7,
      topSpeed: 345,
      torque: 840,
      weight: 1390,
      drivetrain: 'Rear-Wheel Drive (RWD)',
      fuelType: 'Premium Gasoline 98 RON',
      dragCoefficient: 0.32
    }
  },
  {
    id: 'astron-vantage-gt',
    brand: 'ASTRON',
    model: 'Vantage Grand Tourer',
    tagline: 'Effortless continent-crossing poise wrapped in handcrafted silver',
    category: 'Luxury',
    price: 320000,
    formattedPrice: '$320,000',
    image: '/src/assets/images/car_luxury_gt_silver_1792160358557.jpg',
    year: 2026,
    description: 'The epitome of British grand touring royalty. Melding thunderous twin-turbo V12 torque with an acoustic chamber tuned for sheer refinement across the French Riviera or Bavarian autobahns.',
    highlights: [
      'Twin-turbocharged 5.2-litre quad-cam all-alloy V12',
      'Semi-aniline hand-stitched Bridge of Weir leather',
      'Bespoke 1,200W Bowers & Wilkins diamond dome audio',
      'Adaptive skyhook damping with active anti-roll bars'
    ],
    colors: [
      { name: 'Liquid Silver', hex: '#cbd5e1' },
      { name: 'British Racing Green', hex: '#064e3b' },
      { name: 'Tuxedo Black', hex: '#0f172a' },
      { name: 'Champagne Quartz', hex: '#d6d3d1' }
    ],
    specs: {
      horsepower: 715,
      engine: '5.2L Twin-Turbo All-Alloy V12',
      displacement: '5,204 cc',
      transmission: '8-Speed ZF Torque-Converter Automatic',
      acceleration: 3.2,
      topSpeed: 335,
      torque: 900,
      weight: 1745,
      drivetrain: 'Rear-Wheel Drive (RWD) with Limited-Slip Diff',
      fuelType: 'Premium Unleaded',
      dragCoefficient: 0.34
    }
  },
  {
    id: 'aetherius-hyper-ev',
    brand: 'AETHERIUS',
    model: 'Phantom Aero Quad-EV',
    tagline: 'Instantaneous torque vectoring meets zero-emission dominance',
    category: 'Electric',
    price: 2900000,
    formattedPrice: '$2,900,000',
    image: '/src/assets/images/car_electric_hyper_cyan_1792160358447.jpg',
    year: 2026,
    description: 'Engineered at the boundary where aerospace computing merges with motorsport. Four independent silicon-carbide inverters modulate torque at each wheel 100 times per millisecond.',
    highlights: [
      'Quad permanent magnet synchronous electric motors',
      '800V silicon-carbide architecture with 450 kW charging',
      'Structural carbon-honeycomb battery pack at floor level',
      'Active wake-steering aerodynamic flaps with DRS'
    ],
    colors: [
      { name: 'Stealth Graphite', hex: '#1e293b' },
      { name: 'Cyber Neon Cyan', hex: '#06b6d4' },
      { name: 'Polar Frost White', hex: '#f1f5f9' },
      { name: 'Shadow Carbon', hex: '#09090b' }
    ],
    specs: {
      horsepower: 1450,
      engine: 'Quad Independent Synchronous Electric Motors',
      displacement: 'Pure Electric 120 kWh',
      transmission: 'Direct-Drive Single-Speed Planetary',
      acceleration: 1.85,
      topSpeed: 415,
      torque: 1750,
      weight: 1820,
      drivetrain: 'All-Wheel Drive (AWD) Torque Vectoring',
      fuelType: '800V High Density Lithium-NMC Cell',
      dragCoefficient: 0.22
    }
  },
  {
    id: 'vanguard-dominus',
    brand: 'VANGUARD',
    model: 'Dominus V8 Super-SUV',
    tagline: 'Imperious elevated presence with genuine track capability',
    category: 'SUV',
    price: 2450000,
    formattedPrice: '$245,000',
    image: '/src/assets/images/car_hyper_suv_1792160380463.jpg',
    year: 2026,
    description: 'Proving that command seating and sports car dynamism are not mutually exclusive. The Dominus harnesses a twin-turbo hot-inside-V engine paired with 48-volt active roll stabilization.',
    highlights: [
      'Twin-scroll hot-V twin-turbocharged aluminum engine',
      'Three-chamber air suspension with 60mm lift capability',
      '420mm front carbon ceramic brakes with 10-piston calipers',
      'Executive rear seating lounge with climate massage'
    ],
    colors: [
      { name: 'Midnight Metallic Blue', hex: '#1e3a8a' },
      { name: 'Onyx Black', hex: '#020617' },
      { name: 'Storm Grey', hex: '#475569' },
      { name: 'Imperial Red', hex: '#991b1b' }
    ],
    specs: {
      horsepower: 707,
      engine: '4.0L Twin-Turbo Hot-V V8',
      displacement: '3,982 cc',
      transmission: '9-Speed Wet-Clutch Automatic',
      acceleration: 3.4,
      topSpeed: 310,
      torque: 900,
      weight: 2240,
      drivetrain: 'Intelligent Variable All-Wheel Drive',
      fuelType: 'Premium Gasoline',
      dragCoefficient: 0.36
    }
  },
  {
    id: 'zenith-apex-77',
    brand: 'ZENITH',
    model: 'Apex 77 Track Spec',
    tagline: 'Pure uncompromised track homologation for apex hunters',
    category: 'Sports',
    price: 1850000,
    formattedPrice: '$1,850,000',
    image: '/src/assets/images/car_speedster_yellow_1792160379909.jpg',
    year: 2026,
    description: 'Stripped of every superfluous gram. The Zenith Apex 77 uses aerospace carbon fiber prepreg body panels, polycarbonate windows, and an 890 HP naturally-breathing power unit for unmatched purity.',
    highlights: [
      'Full carbon fiber monocoque weighing only 980 kg dry',
      'Pushrod cantilever double-wishbone Multimatic dampers',
      'Swan-neck mounted top-hung dual element rear wing',
      'FIA-certified integrated chromoly safety cage'
    ],
    colors: [
      { name: 'Apex Track Yellow', hex: '#eab308' },
      { name: 'Raw Carbon Fiber', hex: '#171717' },
      { name: 'Monza Red', hex: '#ef4444' },
      { name: 'Pure White', hex: '#ffffff' }
    ],
    specs: {
      horsepower: 890,
      engine: '4.0L High-Revving Naturally Aspirated V8',
      displacement: '3,996 cc',
      transmission: '6-Speed Pneumatic Paddle Sequential',
      acceleration: 2.4,
      topSpeed: 360,
      torque: 680,
      weight: 980,
      drivetrain: 'Rear-Wheel Drive (RWD) with Mechanical LSD',
      fuelType: '100 RON Race Fuel / 98 RON',
      dragCoefficient: 0.35
    }
  },
  {
    id: 'sovereign-stealth-gt',
    brand: 'SOVEREIGN',
    model: 'Stealth Continental GT',
    tagline: 'Understated dominance with brutal W12 authority',
    category: 'Luxury',
    price: 310000,
    formattedPrice: '$310,000',
    image: '/src/assets/images/car_stealth_gt_matte_1792160381734.jpg',
    year: 2026,
    description: 'An architectural sculpture wrapped in deep matte obsidian and forged satin bronze. Handcrafted in Crewe with 200 hours devoted strictly to interior bookmatched veneers and knurled titanium controls.',
    highlights: [
      'Hand-assembled 6.0-litre twin-turbo W12 engine',
      'Rotating central dashboard display with analogue chronometer',
      'Three-chamber active air springs with continuous damping',
      'Laser-welded acoustic glazing with active road noise cancellation'
    ],
    colors: [
      { name: 'Matte Stealth Black', hex: '#1c1917' },
      { name: 'Forged Bronze Accents', hex: '#78350f' },
      { name: 'Slate Anthracite', hex: '#334155' },
      { name: 'Oxford Deep Blue', hex: '#1e1b4b' }
    ],
    specs: {
      horsepower: 650,
      engine: '6.0L Twin-Turbocharged W12 TSI',
      displacement: '5,950 cc',
      transmission: '8-Speed Dual-Clutch Transmission',
      acceleration: 3.5,
      topSpeed: 325,
      torque: 900,
      weight: 2165,
      drivetrain: 'Active All-Wheel Drive with Rear Bias',
      fuelType: 'Premium Gasoline',
      dragCoefficient: 0.33
    }
  },
  {
    id: 'rimac-aethelgard',
    brand: 'AETHELGARD',
    model: 'Nevera GT Hyper-EV',
    tagline: 'The undisputed master of the hyper-electric universe',
    category: 'Electric',
    price: 2400000,
    formattedPrice: '$2,400,000',
    image: '/src/assets/images/car_electric_hyper_white_1792160380319.jpg',
    year: 2026,
    description: 'Unleashing nearly two thousand metric horsepower through quad individual inverters. Capable of bending physics with lateral cornering forces exceeding 1.7G.',
    highlights: [
      'Quad bespoke permanent magnet electric motors',
      'All-Wheel Torque Vectoring 2 (AWTV) computing system',
      'Full carbon-fiber tub with bonded roof structure',
      'Advanced driver AI coach for circuit corner telemetry'
    ],
    colors: [
      { name: 'Pearl Metallic White', hex: '#f8fafc' },
      { name: 'Cosmic Blue', hex: '#1d4ed8' },
      { name: 'Solar Flare Orange', hex: '#f97316' },
      { name: 'Carbon Stealth', hex: '#0f172a' }
    ],
    specs: {
      horsepower: 1914,
      engine: '4x Independent Electric Motors (1.4 MW)',
      displacement: '120 kWh Lithium-Manganese-Nickel Battery',
      transmission: 'Four Independent Single-Speed Gearboxes',
      acceleration: 1.74,
      topSpeed: 420,
      torque: 2360,
      weight: 1950,
      drivetrain: 'All-Wheel Drive (AWD) Independent Torque Vectoring',
      fuelType: '800V Ultra-Fast DC 500kW',
      dragCoefficient: 0.28
    }
  }
];
