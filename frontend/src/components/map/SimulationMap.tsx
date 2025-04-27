// components/map/SimulationMap.tsx

import React, { useRef, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { FireRiskData, WeatherData } from '@/types/api';
import {
    GoogleMap,
    Marker,
    useJsApiLoader,
} from '@react-google-maps/api';
import { HeatmapLayer } from '@react-google-maps/api/';

interface SimulationMapProps {
    prediction: FireRiskData | null;
    locationData: WeatherData | null;
    historyPoints?: { lat: number; lng: number; weight: number }[];
    isLoading?: boolean;
}

const mapContainerStyle = { width: '100%', height: '400px' };
const defaultCenter = { lat: 30.3075, lng: 79.7713 };
const defaultZoom = 10;

const SimulationMap: React.FC<SimulationMapProps> = ({
                                                         prediction,
                                                         locationData,
                                                         historyPoints = [],     // pass in past/historical hotspots if you have
                                                         isLoading = false,
                                                     }) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY!,
        libraries: ['visualization'],
    });

    const handleLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    // Decide center & marker
    const center = prediction
        ? { lat: prediction.latitude, lng: prediction.longitude }
        : locationData
            ? { lat: locationData.latitude, lng: locationData.longitude }
            : defaultCenter;

    const markerIcon = prediction
        ? `http://maps.google.com/mapfiles/ms/icons/${
            prediction.riskLevel === 'high'
                ? 'red'
                : prediction.riskLevel === 'medium'
                    ? 'yellow'
                    : 'green'
        }-dot.png`
        : undefined;

    // Build heatmap data: include historyPoints plus current point as weight=1
    const heatData: google.maps.visualization.WeightedLocation[] = [
        ...historyPoints.map((p) => ({
            location: new google.maps.LatLng(p.lat, p.lng),
            weight: p.weight,
        })),
        ...(prediction
            ? [
                {
                    location: new google.maps.LatLng(prediction.latitude, prediction.longitude),
                    weight:
                        prediction.riskLevel === 'extreme'
                            ? 3
                            : prediction.riskLevel === 'high'
                                ? 2
                                : prediction.riskLevel === 'medium'
                                    ? 1
                                    : 0.5,
                },
            ]
            : []),
    ];

    return (
        <Card className="w-full shadow-lg overflow-hidden">
            <CardHeader className="bg-secondary">
                <CardTitle className="text-lg">Simulation Map</CardTitle>
                <CardDescription>
                    {isLoading ? 'Loading map…' : 'Map of your selected or predicted location'}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-[400px] relative overflow-hidden">
                    {(!isLoaded || isLoading) ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-pulse text-muted-foreground">Loading map…</div>
                        </div>
                    ) : (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={center}
                            zoom={defaultZoom}
                            onLoad={handleLoad}
                            mapTypeId="satellite"
                        >
                            {/* Heatmap overlay */}
                            {heatData.length > 0 && (
                                <HeatmapLayer
                                    data={heatData}
                                    options={{
                                        radius: 30,
                                        opacity: 0.7,
                                        dissipating: true,
                                    }}
                                />
                            )}

                            {/* Marker for prediction or input */}
                            {(prediction || locationData) && (
                                <Marker position={center} icon={markerIcon} />
                            )}
                        </GoogleMap>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default SimulationMap;
