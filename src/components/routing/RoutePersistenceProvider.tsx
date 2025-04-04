
import React from 'react';
import { useRoutePersistence } from '@/hooks/useRoutePersistence';

interface RoutePersistenceProviderProps {
  children: React.ReactNode;
}

export const RoutePersistenceProvider: React.FC<RoutePersistenceProviderProps> = ({ children }) => {
  // Use the hook to handle route persistence
  useRoutePersistence();
  
  // Just render children, the hook handles the persistence logic
  return <>{children}</>;
};
