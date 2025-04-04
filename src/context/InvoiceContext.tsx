
import React from 'react';
import { TemplatesProvider, useTemplates } from './TemplatesContext';
import { InvoicesProvider, useInvoices } from './InvoicesContext';
import { CompanyTemplate, Invoice } from '@/types/invoice';

// Combined interface for backward compatibility
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

// Combined hook for backward compatibility
export const useInvoice = (): InvoiceContextType => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, getInvoiceById } = useInvoices();
  const { templates, addTemplate, updateTemplate, deleteTemplate, getTemplateById } = useTemplates();

  return {
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
  };
};

// Combined provider component
export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TemplatesProvider>
      <InvoicesProvider>
        {children}
      </InvoicesProvider>
    </TemplatesProvider>
  );
};
