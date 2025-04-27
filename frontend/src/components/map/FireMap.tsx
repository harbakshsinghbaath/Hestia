import React, {useRef, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {EvacuationRoute, FireRiskData} from '@/types/api';
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '500px',
};

const defaultCenter = {
    lat: 30.307514965742623, // Example center (Dehradun)
    lng: 79.77134475790452,
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
    const mapRef = useRef<google.maps.Map | null>(null);

    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
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

    const onLoad = (map: google.maps.Map) => {
        mapRef.current = map;

        // Add OpenWeatherMap temperature layer
        const openWeatherMapLayer = new window.google.maps.ImageMapType({
            getTileUrl: function (coord, zoom) {
                return `https://tile.openweathermap.org/map/temp_new/${zoom}/${coord.x}/${coord.y}.png?appid=9fc99ada13b22920ee80cc7885bdf8a2`;
            },
            tileSize: new window.google.maps.Size(256, 256),
            opacity: 1,
            name: 'Temperature',
            maxZoom: 19,
        });

        map.overlayMapTypes.insertAt(0, openWeatherMapLayer);
    };

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
                            onLoad={onLoad}
                        >
                            {riskData?.map((zone) => (
                                <Marker
                                    key={zone.id}
                                    position={{lat: zone.latitude, lng: zone.longitude}}
                                    onClick={() => handleZoneClick(zone)}
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
                        </GoogleMap>
                    )}
                </div>

                {/* Risk Legend */}
                <div
                    className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm p-3 rounded-md border border-muted shadow-md">
                    <h4 className="text-xs font-medium mb-2">Risk Legend</h4>
                    <div className="space-y-1.5">
                        {(['low', 'medium', 'high', 'extreme'] as const).map((level) => (
                            <div key={level} className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getRiskColor(level)}`}/>
                                <span className="text-xs capitalize">{level}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FireMap;
