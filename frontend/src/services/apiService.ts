
// This file simulates API calls to a Flask backend
import { FireRiskData, EvacuationRoute, WeatherData, RiskLevel } from '@/types/api';

// Normally these would be actual API endpoints
const API_ENDPOINTS = {
  PREDICT_FIRE: '/predict-fire',
  VULNERABLE_ZONES: '/vulnerable-zones',
  EVACUATION_PLAN: '/evacuation-plan'
};

// Mock data for vulnerable zones (fire risk areas)
const mockVulnerableZones: FireRiskData[] = [
  {
    id: "zone1",
    latitude: 30.3501,
    longitude: 76.3626,
    riskLevel: "high",
    name: "Model Town",
    factors: { temperature: 43, humidity: 20, windSpeed: 20 }
  },
  {
    id: "zone2",
    latitude: 30.3362,
    longitude: 76.3790,
    riskLevel: "medium",
    name: "Civil Lines",
    factors: { temperature: 39, humidity: 30, windSpeed: 16 }
  },
  {
    id: "zone3",
    latitude: 30.3545,
    longitude: 76.3947,
    riskLevel: "extreme",
    name: "Urban Estate Phase 2",
    factors: { temperature: 45, humidity: 15, windSpeed: 25 }
  },
  {
    id: "zone4",
    latitude: 30.3307,
    longitude: 76.3681,
    riskLevel: "low",
    name: "Tripuri",
    factors: { temperature: 36, humidity: 45, windSpeed: 10 }
  },
  {
    id: "zone5",
    latitude: 30.3242,
    longitude: 76.4009,
    riskLevel: "medium",
    name: "Lehal Colony",
    factors: { temperature: 38, humidity: 35, windSpeed: 14 }
  },
  {
    id: "zone6",
    latitude: 30.3567,
    longitude: 76.3809,
    riskLevel: "high",
    name: "Dashmesh Nagar",
    factors: { temperature: 42, humidity: 25, windSpeed: 22 }
  },
  {
    id: "zone7",
    latitude: 30.3452,
    longitude: 76.4101,
    riskLevel: "extreme",
    name: "Sanaur Road",
    factors: { temperature: 46, humidity: 12, windSpeed: 28 }
  },
  {
    id: "zone8",
    latitude: 30.3161,
    longitude: 76.3793,
    riskLevel: "low",
    name: "Ranjit Nagar",
    factors: { temperature: 35, humidity: 50, windSpeed: 9 }
  },
  {
    id: "zone9",
    latitude: 30.3210,
    longitude: 76.3854,
    riskLevel: "medium",
    name: "Baradari",
    factors: { temperature: 37, humidity: 40, windSpeed: 15 }
  },
  {
    id: "zone10",
    latitude: 30.3375,
    longitude: 76.3889,
    riskLevel: "high",
    name: "Patel Nagar",
    factors: { temperature: 41, humidity: 22, windSpeed: 20 }
  }
];

// Mock evacuation routes
const mockEvacuationRoutes: EvacuationRoute[] = [
  {
    id: "route1",
    name: "Northern Evacuation Route",
    points: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7833, lng: -122.4167 },
      { lat: 37.7900, lng: -122.4050 },
      { lat: 37.7952, lng: -122.3950 }
    ],
    safeZone: { lat: 37.7952, lng: -122.3950, name: "East Bay Safe Zone" }
  },
  {
    id: "route2",
    name: "Southern Evacuation Route",
    points: [
      { lat: 37.7339, lng: -122.4565 },
      { lat: 37.7200, lng: -122.4400 },
      { lat: 37.7000, lng: -122.4300 },
      { lat: 37.6800, lng: -122.4200 }
    ],
    safeZone: { lat: 37.6800, lng: -122.4200, name: "South Bay Safe Zone" }
  }
];

// Function to generate random variations for fire risk data to simulate updates
const generateUpdatedRiskData = (): FireRiskData[] => {
  return mockVulnerableZones.map(zone => {
    // Randomly adjust risk level for some zones
    const riskLevels: RiskLevel[] = ["low", "medium", "high", "extreme"];
    const currentIndex = riskLevels.indexOf(zone.riskLevel as RiskLevel);
    let newIndex = currentIndex;
    
    // 30% chance to change the risk level
    if (Math.random() > 0.7) {
      newIndex = Math.max(0, Math.min(3, currentIndex + (Math.random() > 0.5 ? 1 : -1)));
    }
    
    // Update factors with slight variations
    const tempChange = Math.random() * 3 - 1.5; // -1.5 to +1.5 degree change
    const humidityChange = Math.random() * 5 - 2.5; // -2.5 to +2.5 percent change
    const windChange = Math.random() * 4 - 2; // -2 to +2 mph change
    
    return {
      ...zone,
      riskLevel: riskLevels[newIndex],
      factors: {
        temperature: Math.max(15, Math.min(40, Math.round(zone.factors.temperature + tempChange))),
        humidity: Math.max(5, Math.min(80, Math.round(zone.factors.humidity + humidityChange))),
        windSpeed: Math.max(0, Math.min(40, Math.round(zone.factors.windSpeed + windChange)))
      }
    };
  });
};

// API service methods
export const apiService = {
  // Get fire risk zones
  getVulnerableZones: async (): Promise<FireRiskData[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return the generated data
    return generateUpdatedRiskData();
  },
  
  // Predict fire risk based on weather data
  predictFireRisk: async (data: WeatherData): Promise<FireRiskData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simulate prediction based on input values
    let riskLevel: "low" | "medium" | "high" | "extreme" = "low";
    
    // Simple logic to determine risk level based on input values
    const riskScore = (data.temperature / 40 * 10) + 
                      ((100 - data.humidity) / 100 * 10) + 
                      (data.windSpeed / 30 * 10);
    
    if (riskScore > 20) riskLevel = "extreme";
    else if (riskScore > 15) riskLevel = "high";
    else if (riskScore > 10) riskLevel = "medium";
    else riskLevel = "low";
    
    // Return a simulated prediction
    return {
      id: "prediction-" + Date.now(),
      latitude: data.latitude,
      longitude: data.longitude,
      riskLevel: riskLevel,
      name: "Prediction for " + data.locationName,
      factors: {
        temperature: data.temperature,
        humidity: data.humidity,
        windSpeed: data.windSpeed
      }
    };
  },
  
  // Get evacuation plans for a given area
  getEvacuationPlan: async (latitude: number, longitude: number): Promise<EvacuationRoute[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the closest evacuation route based on coordinates
    // In a real app, this would be calculated by the backend
    return mockEvacuationRoutes;
  }
};
