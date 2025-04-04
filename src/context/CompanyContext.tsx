
import React, { createContext, useContext } from 'react';
import { CompanyInfo } from '@/types/invoice';
import { useCompanyData } from '@/hooks/useCompanyData';

interface CompanyContextType {
  companyInfo: CompanyInfo;
  saveCompany: (company: CompanyInfo) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const companyData = useCompanyData();

  return (
    <CompanyContext.Provider value={companyData}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
