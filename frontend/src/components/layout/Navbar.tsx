
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/simulation', label: 'Simulation' },
  { path: '/evacuation', label: 'Evacuation' },
];

const Navbar: React.FC = () => {
  return (
    <nav className="bg-secondary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-2">
            <img className="h-6 w-6 text-primary" src="Hestia.png"/>
            <span className="text-xl font-bold">Hestia</span>
          </NavLink>
          <div className="hidden md:block">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <Button variant="outline" size="sm" className="text-foreground">
              <span className="sr-only">Menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
