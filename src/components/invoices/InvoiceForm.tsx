
import React from 'react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useInvoice } from '@/context/InvoiceContext';
import { Invoice } from '@/types/invoice';
import { useInvoiceForm } from '@/hooks/useInvoiceForm';

// Import form section components
import InvoiceDetails from './form-sections/InvoiceDetails';
import ClientInfoForm from './form-sections/ClientInfoForm';
import InvoiceItemsForm from './form-sections/InvoiceItemsForm';
import NotesAndTermsForm from './form-sections/NotesAndTermsForm';

interface InvoiceFormProps {
  initialData?: Invoice;
  onSubmit: (data: Invoice) => void;
  templateId?: string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, onSubmit, templateId }) => {
  const { templates } = useInvoice();
  
  const { 
    form, 
    subtotal, 
    taxAmount, 
    total, 
    createInvoiceFromFormData 
  } = useInvoiceForm({ 
    initialData, 
    templates, 
    templateId 
  });
  
  const handleSubmit = (values: any) => {
    const invoice = createInvoiceFromFormData(values);
    // Set invoice status to "paid" by default
    invoice.status = "paid";
    onSubmit(invoice);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Invoice Details Section */}
        <InvoiceDetails form={form} templates={templates} />
        
        {/* Client Information Section */}
        <ClientInfoForm form={form} />
        
        {/* Invoice Items Section */}
        <InvoiceItemsForm 
          form={form} 
          subtotal={subtotal} 
          taxAmount={taxAmount} 
          total={total} 
        />
        
        {/* Notes and Terms Section */}
        <NotesAndTermsForm form={form} />
        
        <div className="flex justify-end gap-4">
          <Button type="submit" className="bg-invoice-blue hover:bg-invoice-darkBlue">
            {initialData ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
