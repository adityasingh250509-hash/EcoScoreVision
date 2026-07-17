export interface SampleItem {
  id: string;
  name: string;
  category: 'appliance' | 'transport' | 'energy' | 'waste';
  default_unit: 'hours' | 'km' | 'kWh';
  icon: string;
  image: string; // inline base64 or SVG
}

export const SAMPLE_ITEMS: SampleItem[] = [
  {
    id: "ac",
    name: "Air Conditioner",
    category: "appliance",
    default_unit: "hours",
    icon: "Wind",
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23161b22"/><rect x="40" y="80" width="320" height="100" rx="10" fill="%2321262d" stroke="%2330363d" stroke-width="4"/><line x1="50" y1="140" x2="350" y2="140" stroke="%2330363d" stroke-width="2"/><circle cx="80" cy="110" r="8" fill="%232ea44f"/><rect x="240" y="105" width="100" height="10" rx="3" fill="%230d1117"/><path d="M100 200 C 120 230, 140 230, 160 200 M180 200 C 200 230, 220 230, 240 200 M260 200 C 280 230, 300 230, 320 200" stroke="%232ea44f" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`
  },
  {
    id: "car_petrol",
    name: "Petrol Passenger Car",
    category: "transport",
    default_unit: "km",
    icon: "Car",
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23161b22"/><path d="M80 170 L120 120 L240 120 L290 170 L340 170 C355 170 360 180 360 190 L360 210 L330 210 M80 170 L50 170 C35 170 30 180 30 190 L30 210 L70 210" stroke="%2330363d" stroke-width="4" stroke-linecap="round" fill="%2321262d"/><circle cx="110" cy="210" r="25" fill="%230d1117" stroke="%2330363d" stroke-width="4"/><circle cx="110" cy="210" r="10" fill="%232ea44f"/><circle cx="290" cy="210" r="25" fill="%230d1117" stroke="%2330363d" stroke-width="4"/><circle cx="290" cy="210" r="10" fill="%232ea44f"/><rect x="130" y="130" width="45" height="30" rx="3" fill="%230d1117"/><rect x="185" y="130" width="45" height="30" rx="3" fill="%230d1117"/><path d="M30 195 L370 195" stroke="%2330363d" stroke-width="4"/></svg>`
  },
  {
    id: "car_diesel",
    name: "Diesel SUV",
    category: "transport",
    default_unit: "km",
    icon: "Car",
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23161b22"/><path d="M60 170 L110 110 L280 110 L300 140 L350 170 C365 170 370 180 370 190 L370 210 L330 210 M60 170 L40 170 C25 170 20 180 20 190 L20 210 L80 210" stroke="%2330363d" stroke-width="4" stroke-linecap="round" fill="%2321262d"/><circle cx="110" cy="210" r="28" fill="%230d1117" stroke="%2330363d" stroke-width="4"/><circle cx="110" cy="210" r="12" fill="%23f1c40f"/><circle cx="290" cy="210" r="28" fill="%230d1117" stroke="%2330363d" stroke-width="4"/><circle cx="290" cy="210" r="12" fill="%23f1c40f"/><rect x="120" y="120" width="60" height="35" rx="3" fill="%230d1117"/><rect x="195" y="120" width="60" height="35" rx="3" fill="%230d1117"/><path d="M20 195 L380 195" stroke="%2330363d" stroke-width="4"/></svg>`
  },
  {
    id: "electricity",
    name: "Grid Electricity Connection",
    category: "energy",
    default_unit: "kWh",
    icon: "Zap",
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23161b22"/><path d="M200 40 L160 140 L240 140 L200 260" stroke="%232ea44f" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="200" cy="140" r="12" fill="%232ea44f" opacity="0.3"/><circle cx="200" cy="140" r="6" fill="%23f0f6fc"/></svg>`
  },
  {
    id: "waste",
    name: "Landfill Waste Bin",
    category: "waste",
    default_unit: "hours",
    icon: "Trash2",
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23161b22"/><path d="M110 80 L290 80 L270 250 L130 250 Z" fill="%2321262d" stroke="%2330363d" stroke-width="4"/><path d="M90 60 L310 60 L310 80 L90 80 Z" fill="%2321262d" stroke="%2330363d" stroke-width="4"/><line x1="160" y1="110" x2="160" y2="220" stroke="%2330363d" stroke-width="4" stroke-linecap="round"/><line x1="200" y1="110" x2="200" y2="220" stroke="%2330363d" stroke-width="4" stroke-linecap="round"/><line x1="240" y1="110" x2="240" y2="220" stroke="%2330363d" stroke-width="4" stroke-linecap="round"/><rect x="170" y="30" width="60" height="30" rx="5" fill="none" stroke="%2330363d" stroke-width="4"/></svg>`
  }
];
