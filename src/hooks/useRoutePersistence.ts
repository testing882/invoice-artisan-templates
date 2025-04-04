
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useRoutePersistence = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Save current route to localStorage when it changes
  useEffect(() => {
    // Skip saving the auth route to prevent redirection loops
    if (location.pathname !== '/auth') {
      localStorage.setItem('lastRoute', location.pathname + location.search);
    }
  }, [location]);

  // Restore route on initial load
  useEffect(() => {
    const lastRoute = localStorage.getItem('lastRoute');
    
    // Only navigate if:
    // 1. There's a saved route
    // 2. We're on the home page (not already on a specific route)
    // 3. The saved route isn't the current route
    if (lastRoute && location.pathname === '/' && lastRoute !== '/') {
      // Small timeout to avoid navigation conflicts
      const timer = setTimeout(() => {
        navigate(lastRoute, { replace: true });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [navigate, location.pathname]);
};
