
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EvacuationRoute } from '@/types/api';
import { Route, Flag, Map } from 'lucide-react';

interface EvacuationPlanProps {
  evacuationRoutes: EvacuationRoute[] | null;
  isLoading: boolean;
  onViewRouteClick: (route: EvacuationRoute) => void;
}

const EvacuationPlan: React.FC<EvacuationPlanProps> = ({
  evacuationRoutes,
  isLoading,
  onViewRouteClick
}) => {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Evacuation Plans</CardTitle>
          <CardDescription>Loading evacuation routes...</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          <div className="animate-pulse">Retrieving evacuation data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!evacuationRoutes || evacuationRoutes.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Evacuation Plans</CardTitle>
          <CardDescription>No evacuation routes available</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          No evacuation data is available for the selected area.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Evacuation Plans</CardTitle>
        <CardDescription>Available evacuation routes for affected areas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {evacuationRoutes.map(route => (
          <Card key={route.id} className="overflow-hidden">
            <CardHeader className="bg-secondary py-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Route className="h-5 w-5 text-primary" />
                <span>{route.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Flag className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Safe Zone:</div>
                  <div className="text-sm">{route.safeZone.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Coordinates: {route.safeZone.lat.toFixed(4)}, {route.safeZone.lng.toFixed(4)}
                  </div>
                </div>
              </div>
              
              <div className="text-sm border-t border-border pt-3 mt-3">
                <div className="flex justify-between">
                  <div>Route Length:</div>
                  <div className="font-medium">{(route.points.length - 1) * 2} km (approx)</div>
                </div>
                <div className="flex justify-between mt-1">
                  <div>Waypoints:</div>
                  <div className="font-medium">{route.points.length}</div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => onViewRouteClick(route)}
              >
                <Map className="h-4 w-4 mr-2" />
                View on Map
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default EvacuationPlan;
