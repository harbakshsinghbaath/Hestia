import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EvacuationRoute, FireRiskData } from '@/types/api';
import { GoogleMap, GroundOverlay, Marker, useJsApiLoader } from '@react-google-maps/api';


const mapContainerStyle = {
    width: '100%',
    height: '500px',
};

const defaultCenter = {
    lat: 30, // Example center (Patiala)
    lng: 76,
};

const defaultZoom = 10;

interface FireMapProps {
    riskData: FireRiskData[] | null;
    evacuationRoutes?: EvacuationRoute[] | null;
    isLoading?: boolean;
    onZoneClick?: (zone: FireRiskData) => void;
}

const FireMap: React.FC<FireMapProps> = ({
                                             riskData,
                                             evacuationRoutes,
                                             isLoading = false,
                                             onZoneClick,
                                         }) => {
    const [selectedZone, setSelectedZone] = useState<FireRiskData | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDMF82kfMeWC5Tt4lYYYYH8LxyHdaP3vsY", // << Replace with environment variable!
    });

    const handleZoneClick = (zone: FireRiskData) => {
        setSelectedZone(zone);
        if (onZoneClick) onZoneClick(zone);
    };

    const getRiskColor = (riskLevel: FireRiskData['riskLevel']) => {
        switch (riskLevel) {
            case 'low':
                return 'bg-fire-low';
            case 'medium':
                return 'bg-fire-medium';
            case 'high':
                return 'bg-fire-high';
            case 'extreme':
                return 'bg-fire-extreme';
            default:
                return 'bg-gray-400';
        }
    };

    useEffect(() => {
        console.log('Map would update with risk data:', riskData);
        console.log('Map would show evacuation routes:', evacuationRoutes);
    }, [riskData, evacuationRoutes]);

    return (
        <Card className="w-full shadow-lg overflow-hidden">
            <CardHeader className="bg-secondary">
                <CardTitle className="text-lg">Fire Risk Visualization</CardTitle>
                <CardDescription>
                    {isLoading ? 'Loading map data...' : 'Interactive map showing current fire risk areas'}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0 relative">
                <div className="h-[500px] bg-accent-foreground relative overflow-hidden">
                    {isLoading || !isLoaded ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-pulse text-muted-foreground">Loading map data...</div>
                        </div>
                    ) : (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={defaultCenter}
                            zoom={defaultZoom}
                        >
                            <GroundOverlay
                                url={`https://tile.openweathermap.org/map/temp_new/9/${Math.round(
                                    defaultCenter.lng,
                                )}/${Math.round(defaultCenter.lat)}.png?appid=9fc99ada13b22920ee80cc7885bdf8a2`}
                                bounds={{
                                    north: 90,
                                    south: -90,
                                    east: 180,
                                    west: -180,
                                }}
                                opacity={0.6}
                            />
                        </GoogleMap>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default FireMap;
