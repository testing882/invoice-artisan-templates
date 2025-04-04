
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
      console.log('Saved route:', location.pathname + location.search);
    }
  }, [location]);

  // Restore route on initial load - this runs once when the component mounts
  useEffect(() => {
    const lastRoute = localStorage.getItem('lastRoute');
    console.log('Current path:', location.pathname, 'Last route:', lastRoute);
    
    // Only navigate if:
    // 1. There's a saved route
    // 2. We're on the home page (not already on a specific route)
    // 3. The saved route isn't the current route
    if (lastRoute && location.pathname === '/' && lastRoute !== '/') {
      console.log('Navigating to saved route:', lastRoute);
      // No timeout needed, just navigate immediately
      navigate(lastRoute, { replace: true });
    }
  }, []); // Empty dependency array ensures this runs only once on mount
};
