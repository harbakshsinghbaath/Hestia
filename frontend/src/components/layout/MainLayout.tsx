
import React from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-secondary py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          Hestia - Forest Fire Prevention & Management System © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
