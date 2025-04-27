
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Map, Thermometer, Route } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <Card className="h-full glass-morphism hover:bg-white/10 transition-colors">
      <CardContent className="p-6">
        <div className="mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const Home: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 min-h-screen">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img className="h-20 w-30 text-primary" src="Hestia.png" alt="logo"/>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-primary">
            Hestia
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Advanced forest fire prevention and management system powered by cutting-edge technology
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="glass-morphism text-white hover:text-black">
              <Link to="/dashboard">
                <Map className="mr-2 h-5 w-5" />
                View Fire Risk Map
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="glass-morphism">
              <Link to="/simulation">
                <Thermometer className="mr-2 h-5 w-5" />
                Run Simulation
              </Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <FeatureCard
            icon={Map}
            title="Risk Visualization"
            description="Interactive map with real-time risk assessment and dynamic heatmap overlays representing danger levels."
          />
          <FeatureCard
            icon={Thermometer}
            title="Predictive Analysis"
            description="Advanced algorithms to predict fire risks using comprehensive environmental data analysis."
          />
          <FeatureCard
            icon={Route}
            title="Evacuation Planning"
            description="Generate optimal evacuation routes based on real-time fire scenarios and safety parameters."
          />
        </div>
        
        {/* About Section */}
        <motion.div 
          className="glass-morphism rounded-2xl p-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gradient-primary">About Hestia</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Hestia represents the cutting edge of forest fire prevention and management technology. By combining advanced algorithms with real-time data analysis, we provide unprecedented accuracy in fire risk assessment and management.
            </p>
            <p>
              Our system integrates environmental data, including temperature, humidity, and wind patterns, to create dynamic visualizations that help prevent and manage forest fires effectively.
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild size="lg" className="glass-morphism text-white hover:text-black">
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Home;
