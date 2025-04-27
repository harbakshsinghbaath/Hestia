// pages/Simulation.tsx
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SimulationForm from '@/components/simulation/SimulationForm';
import SimulationMap from '@/components/map/SimulationMap';
import RiskInfoPanel from '@/components/dashboard/RiskInfoPanel';
import { apiService } from '@/services/apiService';
import { FireRiskData, WeatherData } from '@/types/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Simulation: React.FC = () => {
    const [formInputs, setFormInputs] = useState<WeatherData | null>(null);
    const [prediction, setPrediction] = useState<FireRiskData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSubmitSimulation = async (data: WeatherData) => {
        // Save the raw inputs so we can show them on the map immediately
        setFormInputs(data);
        setPrediction(null);
        setLoading(true);
        setError(null);

        try {
            const result = await apiService.predictFireRisk(data);
            setPrediction(result);
            // show toast…
        } catch (err) {
            setError('Failed to process simulation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            {/* … header, error, form… */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SimulationForm onSubmit={handleSubmitSimulation} isLoading={loading} />

                <div className="space-y-6">
                    {/* … Results panel … */}

                    {/* Pass BOTH formInputs and prediction into the map */}
                    <SimulationMap
                        prediction={prediction}
                        locationData={formInputs}
                        isLoading={loading}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default Simulation;
