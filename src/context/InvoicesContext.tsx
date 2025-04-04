
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';
import { toast } from 'sonner';
import { STORAGE_KEYS } from './types';
import { useTemplates } from './TemplatesContext';

interface InvoicesContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export const InvoicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { templates } = useTemplates();

  // Create a sample invoice using the first template
  const createSampleInvoice = (): Invoice => {
    if (templates.length === 0) {
      console.error("Cannot create sample invoice: no templates available");
      return null as unknown as Invoice;
    }
    
    return {
      id: '1',
      invoiceNumber: 'INV-20250404-0001',
      date: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      company: templates[0],
      client: {
        name: 'Client Company Ltd',
        address: '456 Client Ave',
        city: 'Clientville',
        postalCode: '54321',
        country: 'USA',
      },
      items: [
        {
          id: '1',
          description: 'Web Development Services',
          quantity: 40,
          rate: 75,
          amount: 3000,
        },
        {
          id: '2',
          description: 'UI/UX Design',
          quantity: 20,
          rate: 85,
          amount: 1700,
        },
      ],
      notes: 'Thank you for your business!',
      totalAmount: 4700,
      taxRate: 8.5,
      taxAmount: 399.5,
      status: 'draft',
    };
  };

  // Load saved invoices from localStorage on initial render
  useEffect(() => {
    if (templates.length === 0) {
      console.log('Waiting for templates to load before loading invoices');
      return;
    }

    try {
      console.log('Loading invoices from localStorage');
      const savedInvoices = localStorage.getItem(STORAGE_KEYS.INVOICES_STORAGE_KEY);
      
      if (savedInvoices) {
        const parsedInvoices = JSON.parse(savedInvoices);
        // Convert string dates back to Date objects
        const processedInvoices = parsedInvoices.map((invoice: any) => ({
          ...invoice,
          date: new Date(invoice.date),
          dueDate: new Date(invoice.dueDate),
        }));
        setInvoices(processedInvoices);
      } else {
        console.log('No saved invoices found, using sample');
        const sampleInvoice = createSampleInvoice();
        setInvoices([sampleInvoice]);
      }
    } catch (error) {
      console.error('Error loading saved invoices:', error);
      toast.error('Failed to load saved invoices');
      
      // Fallback to sample data if there's an error
      const sampleInvoice = createSampleInvoice();
      setInvoices([sampleInvoice]);
    }
  }, [templates]);

  // Save to localStorage whenever invoices change
  useEffect(() => {
    if (invoices.length === 0) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES_STORAGE_KEY, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoices:', error);
      toast.error('Failed to save invoices');
    }
  }, [invoices]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [...prev, invoice]);
    toast.success('Invoice created successfully');
  };

  const updateInvoice = (invoice: Invoice) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? invoice : inv)));
    toast.success('Invoice updated successfully');
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    toast.success('Invoice deleted successfully');
  };

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  return (
    <InvoicesContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceById,
      }}
    >
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
