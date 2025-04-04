
import React from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from '@/components/ui/sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};
