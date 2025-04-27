// components/map/EvacuationMap.tsx

import React, { useRef } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { EvacuationRoute, FireRiskData } from '@/types/api';
import {
    GoogleMap,
    Marker,
    Polyline,
    useJsApiLoader,
    HeatmapLayer,
} from '@react-google-maps/api';

interface EvacuationMapProps {
    riskData: FireRiskData[] | null;
    evacuationRoutes: EvacuationRoute[] | null;
    selectedRoute: EvacuationRoute | null;
    isLoading?: boolean;
}

const mapContainerStyle = { width: '100%', height: '500px' };
const defaultCenter = { lat: 30.3075, lng: 79.7713 };
const defaultZoom = 10;

const EvacuationMap: React.FC<EvacuationMapProps> = ({
                                                         riskData,
                                                         evacuationRoutes,
                                                         selectedRoute,
                                                         isLoading = false,
                                                     }) => {
    const mapRef = useRef<google.maps.Map | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY!,
        libraries: ['visualization'], // load heatmap library
    });

    const handleLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    // Center on selected route start or default
    const center = selectedRoute
        ? selectedRoute.points[0]
        : defaultCenter;

    return (
        <Card className="w-full shadow-lg overflow-hidden">
            <CardHeader className="bg-secondary">
                <CardTitle className="text-lg">Evacuation Map</CardTitle>
                <CardDescription>
                    {isLoading ? 'Loading map…' : 'Visualizing evacuation routes'}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-[500px] relative overflow-hidden">
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
                            {/* Heatmap overlay based on riskData */}
                            {riskData && riskData.length > 0 && (
                                <HeatmapLayer
                                    data={riskData.map(zone => ({
                                        location: new google.maps.LatLng(zone.latitude, zone.longitude),
                                        weight:
                                            zone.riskLevel === 'extreme' ? 3 :
                                                zone.riskLevel === 'high'    ? 2 :
                                                    zone.riskLevel === 'medium'  ? 1 : 0.5
                                    }))}
                                    options={{ radius: 30, opacity: 0.6, dissipating: true }}
                                />
                            )}

                            {/* Fire risk zone markers */}
                            {riskData?.map(zone => (
                                <Marker
                                    key={zone.id}
                                    position={{ lat: zone.latitude, lng: zone.longitude }}
                                    icon={{
                                        url: `http://maps.google.com/mapfiles/ms/icons/${
                                            zone.riskLevel === 'high'
                                                ? 'red'
                                                : zone.riskLevel === 'medium'
                                                    ? 'yellow'
                                                    : 'green'
                                        }-dot.png`,
                                    }}
                                />
                            ))}

                            {/* Draw evacuation routes */}
                            {evacuationRoutes?.map(route => (
                                <Polyline
                                    key={route.id}
                                    path={route.points.map(p => ({ lat: p.lat, lng: p.lng }))}
                                    options={{
                                        strokeColor: route.id === selectedRoute?.id ? '#00BFFF' : '#888',
                                        strokeOpacity: route.id === selectedRoute?.id ? 0.8 : 0.5,
                                        strokeWeight: route.id === selectedRoute?.id ? 4 : 2,
                                    }}
                                />
                            ))}

                            {/* Safe-zone marker for selected route */}
                            {selectedRoute && (
                                <Marker
                                    position={{
                                        lat: selectedRoute.safeZone.lat,
                                        lng: selectedRoute.safeZone.lng,
                                    }}
                                    icon={{
                                        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                                    }}
                                />
                            )}
                        </GoogleMap>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default EvacuationMap;
