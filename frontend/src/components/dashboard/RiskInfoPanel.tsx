import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Thermometer, Wind, Flag, AlertCircle } from 'lucide-react';
import { FireRiskData } from '@/types/api';

interface RiskInfoPanelProps {
  riskData: FireRiskData | null;
}

const RiskInfoPanel: React.FC<RiskInfoPanelProps> = ({ riskData }) => {
  if (!riskData) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Risk Information</CardTitle>
          <CardDescription>Select a zone on the map to view details</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          No zone selected. Click on a risk zone to view details.
        </CardContent>
      </Card>
    );
  }
  
  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'fire-risk-badge-low';
      case 'medium': return 'fire-risk-badge-medium';
      case 'high': return 'fire-risk-badge-high';
      case 'extreme': return 'fire-risk-badge-extreme';
      default: return 'bg-gray-400 text-white';
    }
  };
  
  const getRiskDescription = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': 
        return 'Minimal fire risk. Regular monitoring recommended.';
      case 'medium': 
        return 'Moderate fire risk. Increased vigilance required.';
      case 'high': 
        return 'High fire risk. Take preventive measures immediately.';
      case 'extreme': 
        return 'Extreme danger! Evacuation may be necessary.';
      default: 
        return 'Risk level undetermined.';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className={`bg-secondary ${riskData.riskLevel === 'extreme' ? 'border-b-2 border-fire-extreme' : ''}`}>
        <div className="flex justify-between items-center">
          <CardTitle>{riskData.name}</CardTitle>
          <span className={getRiskBadgeClass(riskData.riskLevel)}>
            {riskData.riskLevel.toUpperCase()}
          </span>
        </div>
        <CardDescription>
          Location: {riskData.latitude.toFixed(4)}, {riskData.longitude.toFixed(4)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          <span className="font-medium">Risk Assessment</span>
        </div>
        <p className="text-sm pl-7">{getRiskDescription(riskData.riskLevel)}</p>
        
        <Separator className="my-2" />
        
        <div>
          <h4 className="text-sm font-medium mb-3">Environmental Factors</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-lg p-3 text-center">
              <Thermometer className="h-5 w-5 mx-auto text-fire-medium mb-1" />
              <div className="text-xs text-muted-foreground">Temperature</div>
              <div className="text-lg font-semibold">{riskData.factors.temperature}°C</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center">
              <Flag className="h-5 w-5 mx-auto text-blue-400 mb-1" />
              <div className="text-xs text-muted-foreground">Humidity</div>
              <div className="text-lg font-semibold">{riskData.factors.humidity}%</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center">
              <Wind className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <div className="text-xs text-muted-foreground">Wind Speed</div>
              <div className="text-lg font-semibold">{riskData.factors.windSpeed} km/h</div>
            </div>
          </div>
        </div>
        
        {riskData.riskLevel === 'high' || riskData.riskLevel === 'extreme' ? (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <h4 className="text-sm font-medium flex items-center space-x-1">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span>Recommended Actions</span>
            </h4>
            <ul className="text-sm pl-5 mt-2 list-disc space-y-1">
              <li>Increase monitoring frequency</li>
              <li>Alert local fire departments</li>
              <li>Prepare evacuation routes</li>
              {riskData.riskLevel === 'extreme' && (
                <li className="font-medium text-destructive">Consider immediate evacuation</li>
              )}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default RiskInfoPanel;
