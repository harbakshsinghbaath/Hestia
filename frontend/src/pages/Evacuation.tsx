import React, {useEffect, useState} from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EvacuationMap from '@/components/map/EvacuationMap';
import EvacuationPlan from '@/components/evacuation/EvacuationPlan';
import {apiService} from '@/services/apiService';
import {EvacuationRoute, FireRiskData} from '@/types/api';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle, Route} from 'lucide-react';

const Evacuation: React.FC = () => {
    const [evacuationRoutes, setEvacuationRoutes] = useState<EvacuationRoute[] | null>(null);
    const [selectedRoute, setSelectedRoute] = useState<EvacuationRoute | null>(null);
    const [riskData, setRiskData] = useState<FireRiskData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Coordinates state for user input
    const [latitude, setLatitude] = useState<string>("37.7749");
    const [longitude, setLongitude] = useState<string>("-122.4194");

    // Fetch risk data for displaying on the map
    useEffect(() => {
        const fetchRiskData = async () => {
            try {
                const data = await apiService.getVulnerableZones();
                setRiskData(data);
            } catch (err) {
                console.error("Error fetching risk data:", err);
            }
        };

        fetchRiskData();
    }, []);

    // Handle form submission to fetch evacuation routes
    const handleFetchEvacuationRoutes = async () => {
        setLoading(true);
        setError(null);

        try {
            // Convert inputs to numbers
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lng)) {
                throw new Error("Please enter valid coordinates.");
            }

            const routes = await apiService.getEvacuationPlan(lat, lng);
            setEvacuationRoutes(routes);

            // If routes were found, select the first one by default
            if (routes && routes.length > 0) {
                setSelectedRoute(routes[0]);
            } else {
                setSelectedRoute(null);
            }

            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch evacuation routes.");
            setLoading(false);
            console.error("Error fetching evacuation routes:", err);
        }
    };

    // Handle selecting a specific route to view
    const handleViewRoute = (route: EvacuationRoute) => {
        setSelectedRoute(route);
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Evacuation Planning</h1>
                    <p className="text-muted-foreground">
                        Generate and visualize evacuation routes for affected areas
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-medium mb-4">Enter Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="text"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="Enter latitude"
                            />
                        </div>
                        <div>
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="text"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="Enter longitude"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleFetchEvacuationRoutes}
                        disabled={loading}
                        className="w-full md:w-auto"
                    >
                        <Route className="mr-2 h-5 w-5"/>
                        {loading ? 'Generating Routes...' : 'Find Evacuation Routes'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <EvacuationMap
                            riskData={riskData}
                            evacuationRoutes={evacuationRoutes}
                            selectedRoute={selectedRoute}
                            isLoading={loading}
                        />
                    </div>
                    <div>
                        <EvacuationPlan
                            evacuationRoutes={evacuationRoutes}
                            isLoading={loading}
                            onViewRouteClick={handleViewRoute}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Evacuation;
