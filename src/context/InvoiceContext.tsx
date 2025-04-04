
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, CompanyTemplate, ClientInfo, InvoiceItem } from '@/types/invoice';
import { toast } from 'sonner';

interface InvoiceContextType {
  invoices: Invoice[];
  templates: CompanyTemplate[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  addTemplate: (template: CompanyTemplate) => void;
  updateTemplate: (template: CompanyTemplate) => void;
  deleteTemplate: (id: string) => void;
  getTemplateById: (id: string) => CompanyTemplate | undefined;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const INVOICES_STORAGE_KEY = 'invoiceArtisan_invoices';
const TEMPLATES_STORAGE_KEY = 'invoiceArtisan_templates';

// Sample data
const sampleTemplates: CompanyTemplate[] = [
  {
    id: '1',
    name: 'Acme Inc',
    address: '123 Business St',
    city: 'Techville',
    postalCode: '12345',
    country: 'USA',
    phone: '(555) 123-4567',
    email: 'billing@acmeinc.com',
    taxId: 'US12345678',
    isEU: false,
  },
  {
    id: '2',
    name: 'TechCorp',
    address: '456 Innovation Ave',
    city: 'Silicon Valley',
    postalCode: '94043',
    country: 'USA',
    phone: '(555) 987-6543',
    email: 'accounts@techcorp.com',
    taxId: 'US98765432',
    isEU: false,
  },
  {
    id: '3',
    name: 'EuroSoft GmbH',
    address: '789 Hauptstrasse',
    city: 'Berlin',
    postalCode: '10115',
    country: 'Germany',
    phone: '+49 30 12345678',
    email: 'billing@eurosoft.de',
    taxId: 'DE123456789',
    isEU: true,
  }
];

const sampleInvoice: Invoice = {
  id: '1',
  invoiceNumber: 'INV-20250404-0001',
  date: new Date(),
  dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  company: sampleTemplates[0],
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

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [templates, setTemplates] = useState<CompanyTemplate[]>([]);

  // Load saved data from localStorage on initial render
  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
      const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      
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
        // Set sample invoice if no saved invoices
        setInvoices([sampleInvoice]);
      }
      
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      } else {
        // Set sample templates if no saved templates
        setTemplates(sampleTemplates);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      toast.error('Failed to load saved data');
      
      // Fallback to sample data if there's an error
      setInvoices([sampleInvoice]);
      setTemplates(sampleTemplates);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    }
  }, [invoices, templates]);

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

  const addTemplate = (template: CompanyTemplate) => {
    setTemplates((prev) => [...prev, template]);
    toast.success('Template created successfully');
  };

  const updateTemplate = (template: CompanyTemplate) => {
    setTemplates((prev) => prev.map((temp) => (temp.id === template.id ? template : temp)));
    toast.success('Template updated successfully');
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id));
    toast.success('Template deleted successfully');
  };

  const getTemplateById = (id: string) => {
    return templates.find((template) => template.id === id);
  };

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        templates,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        getTemplateById,
        getInvoiceById,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
