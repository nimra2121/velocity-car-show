# VELOCITY — The Art of Driving

An extraordinary, cinematic, premium 3D automotive experience showcasing the pinnacle of automotive engineering, design, and performance.

## Overview

VELOCITY is an award-winning interactive automotive web experience featuring:
- **Cinematic 3D Showroom**: Real-time Three.js WebGL canvas with physically based rendering (PBR), studio reflections (`RoomEnvironment`), metallic clearcoat paint, contact shadows, directional soft lighting, and collapsible bottom dock controls.
- **Cinematic Photography Mode**: Ultra-high-resolution custom-generated photography with mouse-responsive parallax and layered depth.
- **Live Typing Animation**: Staggered cinematic typewriter heading cycling through brand mantras with a blinking cursor.
- **Interactive Stable of 8 Supercars**:
  - Velocity Apex Valkyrie 01 (V12 Hybrid - 1,180 HP)
  - Scuderia Furia 820 Stradale (Flat-Plane V8 - 820 HP)
  - Astron Vantage Grand Tourer (Twin-Turbo V12 - 715 HP)
  - Aetherius Phantom Aero Quad-EV (Quad Motors - 1,450 HP)
  - Vanguard Dominus Super-SUV (Twin-Turbo V8 - 707 HP)
  - Zenith Apex 77 Track Spec (Naturally Aspirated V8 - 890 HP)
  - Sovereign Stealth Continental GT (Twin-Turbo W12 - 650 HP)
  - Rimac Aethelgard Nevera GT (Quad Electric - 1,914 HP)
- **3D Tilt Interaction**: Mouse coordinate-based card tilt with dynamic metallic glare and zoom transitions.
- **Dynamic Filtering & Sorting**: Categorized by Sports, Luxury, SUV, and Electric with real-time text search and specification sorting.
- **Powertrain Acoustic Simulator**: Interactive Web Audio API synthesizer allowing users to hold and rev the engine up to 9,000 RPM with realistic pitch ramping and harmonic filter modulation.
- **Head-to-Head Compare Garage**: Side-by-side comparative telemetry with animated visual bars and winning indicators across horsepower, 0-100 km/h sprint, top speed, torque, and power-to-weight ratios.
- **Engineering Doctrine & Telemetry**: Four architectural pillars and performance benchmark strip.
- **Studio Portfolio & Lightbox**: High-resolution gallery with interactive full-screen preview.
- **VIP Atelier Reservation**: Functional test drive and consultation booking form with confirmation codes and concierge handling.

## Visual Identity & Design Principles

- **Palette**: Obsidian Black (`#090a0f`), Charcoal (`#10131c`), Metallic Silver (`#cbd5e1`), White (`#f8fafc`), and Aggressive Racing Red (`#ef4444`, `#dc2626`).
- **Typography**: Automotive display font `Rajdhani` and `Oswald` paired with `Plus Jakarta Sans` for body text.
- **Universal Frontend Design Constitution**: Clean top-bar contract, zero-pill metadata discipline, 60-30-10 color distribution, WCAG AA compliance, and responsive desktop/mobile layouts.

## Technical Architecture

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";`)
- **3D Engine**: Three.js r174 (Procedural multi-part hypercar composite group, `MeshPhysicalMaterial`, PMREM RoomEnvironment, ACESFilmicToneMapping)
- **Acoustics**: Web Audio API (real-time procedural engine synthesis)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
Start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
Compile and bundle the application for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Linting & Type Checking
```bash
npm run lint
```
