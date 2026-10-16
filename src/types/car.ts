export type CarCategory = 'Sports' | 'Luxury' | 'SUV' | 'Electric';

export interface CarSpecs {
  horsepower: number; // HP
  engine: string;
  displacement?: string;
  transmission: string;
  acceleration: number; // 0-100 km/h in seconds
  topSpeed: number; // km/h
  torque: number; // Nm
  weight: number; // kg
  drivetrain: string;
  fuelType: string;
  dragCoefficient: number;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  tagline: string;
  category: CarCategory;
  price: number;
  formattedPrice: string;
  image: string;
  specs: CarSpecs;
  description: string;
  highlights: string[];
  colors: { name: string; hex: string }[];
  year: number;
}
