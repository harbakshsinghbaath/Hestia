
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import FireMap from '@/components/map/FireMap';
import RiskInfoPanel from '@/components/dashboard/RiskInfoPanel';
import { apiService } from '@/services/apiService';
import { FireRiskData } from '@/types/api';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [riskData, setRiskData] = useState<FireRiskData[] | null>(null);
  const [selectedZone, setSelectedZone] = useState<FireRiskData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const { toast } = useToast();
  
  const fetchRiskData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getVulnerableZones();
      setRiskData(data);
      
      // If we already have a selected zone, update its data
      if (selectedZone) {
        const updatedZone = data.find(zone => zone.id === selectedZone.id);
        if (updatedZone) {
          setSelectedZone(updatedZone);
          // If risk level increased, show a toast alert
          if (isHigherRiskLevel(updatedZone.riskLevel, selectedZone.riskLevel)) {
            toast({
              title: "Risk Level Increased",
              description: `${updatedZone.name} is now at ${updatedZone.riskLevel.toUpperCase()} risk level`,
              variant: "destructive",
            });
          }
        }
      }
      
      setLoading(false);
      setError(null);
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch fire risk data. Please try again.");
      console.error("Error fetching risk data:", err);
    }
  };
  
  // Utility function to check if a risk level is higher than another
  const isHigherRiskLevel = (newLevel: string, oldLevel: string): boolean => {
    const riskLevels = ["low", "medium", "high", "extreme"];
    return riskLevels.indexOf(newLevel) > riskLevels.indexOf(oldLevel);
  };
  
  // Handle zone selection
  const handleZoneClick = (zone: FireRiskData) => {
    setSelectedZone(zone);
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchRiskData();
  }, []);
  
  // Auto-refresh setup
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        console.log("Auto-refreshing fire risk data...");
        fetchRiskData();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, selectedZone]);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">Fire Risk Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring of forest fire risks</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Auto Refresh:</span>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? "Active" : "Paused"}
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={fetchRiskData} disabled={loading}>
              Refresh Data
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md flex items-center space-x-2 mb-6">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FireMap 
              riskData={riskData} 
              isLoading={loading} 
              onZoneClick={handleZoneClick}
            />
          </div>
          <div>
            <RiskInfoPanel riskData={selectedZone} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
