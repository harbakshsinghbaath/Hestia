
// Type definitions for API data

export type RiskLevel = "low" | "medium" | "high" | "extreme";

export interface WeatherFactors {
  temperature: number;  // Celsius
  humidity: number;     // Percentage
  windSpeed: number;    // km/h
}

export interface FireRiskData {
  id: string;
  latitude: number;
  longitude: number;
  riskLevel: RiskLevel;
  name: string;
  factors: WeatherFactors;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface SafeZone {
  lat: number;
  lng: number;
  name: string;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  points: GeoPoint[];
  safeZone: SafeZone;
}

export interface WeatherData {
  locationName: string;
  latitude: number;
  longitude: number;
  temperature: number;   // Celsius
  humidity: number;      // Percentage
  windSpeed: number;     // km/h
  cloudCover: number;    // Percentage
  precipitation: number; // mm
  windDirection: number; // Degrees from North
}
