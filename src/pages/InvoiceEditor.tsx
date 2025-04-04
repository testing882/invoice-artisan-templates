
import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvoices } from '@/context/InvoicesContext';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { Invoice } from '@/types/invoice';
import { toast } from 'sonner';

const InvoiceEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const navigate = useNavigate();
  const { addInvoice, updateInvoice, getInvoiceById } = useInvoices();
  
  const isNewInvoice = !id || id === 'new';
  const invoice = !isNewInvoice ? getInvoiceById(id) : undefined;
  
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
