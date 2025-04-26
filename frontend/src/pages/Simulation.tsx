
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SimulationForm from '@/components/simulation/SimulationForm';
import FireMap from '@/components/map/FireMap';
import RiskInfoPanel from '@/components/dashboard/RiskInfoPanel';
import { apiService } from '@/services/apiService';
import { FireRiskData, WeatherData } from '@/types/api';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Simulation: React.FC = () => {
  const [prediction, setPrediction] = useState<FireRiskData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSubmitSimulation = async (data: WeatherData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.predictFireRisk(data);
      setPrediction(result);
      
      // Show toast notification based on risk level
      const toastVariant = result.riskLevel === 'high' || result.riskLevel === 'extreme' 
        ? 'destructive' 
        : 'default';
      
      toast({
        title: `${result.riskLevel.toUpperCase()} Fire Risk Detected`,
        description: `Simulation results for ${data.locationName} show ${result.riskLevel} risk level`,
        variant: toastVariant,
      });
      
      setLoading(false);
    } catch (err) {
      setError("Failed to process simulation. Please try again.");
      setLoading(false);
      console.error("Simulation error:", err);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Fire Risk Simulation</h1>
          <p className="text-muted-foreground">
            Simulate potential fire risks based on environmental conditions
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimulationForm onSubmit={handleSubmitSimulation} isLoading={loading} />
          
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-4 border border-border">
              <h2 className="text-lg font-medium mb-2">Simulation Results</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {prediction 
                  ? "Prediction based on the provided environmental data:"
                  : "Enter environmental data and run a simulation to see results."}
              </p>
              
              {prediction && (
                <RiskInfoPanel riskData={prediction} />
              )}
            </div>
            
            {prediction && (
              <FireMap 
                riskData={prediction ? [prediction] : null}
                isLoading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Simulation;
