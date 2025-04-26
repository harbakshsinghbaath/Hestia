
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Flame, Map, Thermometer, Route } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Flame className="h-16 w-16 text-primary animate-pulse-fire" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hestia</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Forest Fire Prevention and Management System
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/dashboard">
                <Map className="mr-2 h-5 w-5" />
                View Fire Risk Map
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/simulation">
                <Thermometer className="mr-2 h-5 w-5" />
                Run Simulation
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Map className="h-6 w-6 text-primary" />
                <span>Risk Visualization</span>
              </CardTitle>
              <CardDescription>Interactive map with real-time risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              View forest fire risk zones with dynamic heatmap overlays representing danger levels based on environmental factors.
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Thermometer className="h-6 w-6 text-primary" />
                <span>Predictive Analysis</span>
              </CardTitle>
              <CardDescription>Advanced algorithms to predict fire risks</CardDescription>
            </CardHeader>
            <CardContent>
              Simulate fire risk scenarios by inputting weather data such as temperature, humidity, and wind speed to generate predictive assessments.
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Route className="h-6 w-6 text-primary" />
                <span>Evacuation Planning</span>
              </CardTitle>
              <CardDescription>Emergency response and evacuation routes</CardDescription>
            </CardHeader>
            <CardContent>
              Generate evacuation plans based on fire scenarios, showing safe routes and zones to ensure quick and effective emergency response.
            </CardContent>
          </Card>
        </div>
        
        {/* About Section */}
        <div className="bg-card rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-4">About Hestia</h2>
          <p className="mb-4">
            Hestia is a sophisticated forest fire prevention and management system designed to monitor, predict, and manage wildfire risks in forest areas. Using advanced algorithms and real-time data analysis, Hestia provides accurate fire risk assessments and evacuation planning.
          </p>
          <p>
            This system integrates environmental data including temperature, humidity, and wind speed to create dynamic heat maps visualizing fire risk levels. When high-risk areas are identified, Hestia generates evacuation routes to guide response teams and civilians to safety.
          </p>
          
          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
