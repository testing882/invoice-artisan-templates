
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Download, CalendarPlus, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FileText className="w-5 h-5" /> },
    { name: 'Create Invoice', path: '/create-invoice', icon: <FileText className="w-5 h-5" /> },
    { name: 'Templates', path: '/templates', icon: <CalendarPlus className="w-5 h-5" /> },
    { name: 'Your Company', path: '/company', icon: <Building className="w-5 h-5" /> },
    { name: 'Export', path: '/export', icon: <Download className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-invoice-blue">InvoiceArtisan</h1>
      </div>
      <nav className="px-4 py-6">
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
    </div>
  );
};
