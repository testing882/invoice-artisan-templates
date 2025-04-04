
import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvoices } from '@/context/InvoicesContext';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { Invoice } from '@/types/invoice';
import { toast } from 'sonner';
import { useTemplates } from '@/context/TemplatesContext';

const InvoiceEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const navigate = useNavigate();
  const { addInvoice, updateInvoice, getInvoiceById } = useInvoices();
  const { getTemplateById } = useTemplates();
  
  const isNewInvoice = !id || id === 'new';
  const invoice = !isNewInvoice ? getInvoiceById(id) : undefined;
  
  // Validate the template ID exists
  useEffect(() => {
    if (templateId && !getTemplateById(templateId)) {
      toast.error('Selected template not found');
    }
  }, [templateId, getTemplateById]);
  
  const handleSubmit = (data: Invoice) => {
    if (isNewInvoice) {
      addInvoice(data);
    } else {
      updateInvoice(data);
    }
    
    navigate('/');
  };
  
  if (!isNewInvoice && !invoice) {
    toast.error('Invoice not found');
    navigate('/');
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-invoice-darkGray">
        {isNewInvoice ? 'Create New Invoice' : `Edit Invoice ${invoice?.invoiceNumber}`}
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{isNewInvoice ? 'Invoice Details' : `Editing Invoice`}</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceForm 
            initialData={invoice} 
            onSubmit={handleSubmit}
            templateId={templateId || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceEditor;
