
import React from 'react';
import { TemplatesProvider, useTemplates } from './TemplatesContext';
import { InvoicesProvider, useInvoices } from './InvoicesContext';
import { CompanyTemplate, Invoice } from '@/types/invoice';

interface BulkUpdateData {
  date?: Date;
  dueDate?: Date;
  notes?: string;
}

// Combined interface for backward compatibility
interface InvoiceContextType {
  invoices: Invoice[];
  templates: CompanyTemplate[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  softDeleteInvoice: (id: string) => Promise<void>;
  permanentlyDeleteInvoice: (id: string) => Promise<void>;
  restoreInvoice: (id: string) => Promise<void>;
  bulkUpdateInvoices: (ids: string[], data: BulkUpdateData) => Promise<void>;
  addTemplate: (template: CompanyTemplate) => Promise<void>;
  updateTemplate: (template: CompanyTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  getTemplateById: (id: string) => CompanyTemplate | undefined;
  getInvoiceById: (id: string) => Invoice | undefined;
}

// Combined hook for backward compatibility
export const useInvoice = (): InvoiceContextType => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, softDeleteInvoice, permanentlyDeleteInvoice, restoreInvoice, bulkUpdateInvoices, getInvoiceById } = useInvoices();
  const { templates, addTemplate, updateTemplate, deleteTemplate, getTemplateById } = useTemplates();

  return {
    invoices,
    templates,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    softDeleteInvoice,
    permanentlyDeleteInvoice,
    restoreInvoice,
    bulkUpdateInvoices,
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
