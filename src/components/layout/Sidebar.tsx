
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Download, CalendarPlus, Building, Building2, Files, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FileText className="w-5 h-5" /> },
    { name: 'Your Company', path: '/company', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Create Invoice', path: '/create-invoice', icon: <FileText className="w-5 h-5" /> },
    { name: 'Bulk Invoices', path: '/bulk-invoices', icon: <Files className="w-5 h-5" /> },
    { name: 'Templates', path: '/templates', icon: <CalendarPlus className="w-5 h-5" /> },
    { name: 'Export', path: '/export', icon: <Download className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed top-0 left-0 w-64 bg-sidebar border-r border-border h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-invoice-blue">InvoiceArtisan</h1>
      </div>
      
      <nav className="px-4 py-6 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-invoice-blue text-white"
                    : "hover:bg-invoice-lightGray hover:text-invoice-darkBlue"
                )}
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {user && (
        <div className="p-4 border-t border-border">
          <div className="mb-2 px-3 text-sm text-gray-500">
            Signed in as: <span className="font-medium">{user.email}</span>
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};
