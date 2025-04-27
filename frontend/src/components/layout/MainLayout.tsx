
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-background">
      <Navbar />
      <motion.main 
        className="flex-grow"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeVariants}
      >
        <motion.div
          className="container mx-auto py-6 px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {children}
        </motion.div>
      </motion.main>
      <footer className="bg-secondary py-4 text-center text-sm text-muted-foreground">
        <motion.div 
          className="container mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Hestia - Forest Fire Prevention & Management System © {new Date().getFullYear()}
        </motion.div>
      </footer>
    </div>
  );
};

export default MainLayout;
