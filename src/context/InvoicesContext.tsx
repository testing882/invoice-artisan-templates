
import React, { createContext, useContext } from 'react';
import { Invoice } from '@/types/invoice';
import { useInvoicesData } from '@/hooks/useInvoicesData';

interface InvoicesContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoice: (invoice: Invoice) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  getInvoiceById: (id: string) => Invoice | undefined;
  loading: boolean;
  error: string | null;
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export const InvoicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const invoicesData = useInvoicesData();

  return (
    <InvoicesContext.Provider value={invoicesData}>
      {children}
    </InvoicesContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoicesContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
};
