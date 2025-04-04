
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { toast } from 'sonner';

// Import the smaller components
import InvoiceViewHeader from '@/components/invoices/InvoiceViewHeader';
import InvoiceHeaderCard from '@/components/invoices/InvoiceHeaderCard';
import InvoicePartyInfo from '@/components/invoices/InvoicePartyInfo';
import InvoiceDateInfo from '@/components/invoices/InvoiceDateInfo';
import InvoiceItemsTable from '@/components/invoices/InvoiceItemsTable';
import InvoiceTotals from '@/components/invoices/InvoiceTotals';
import InvoiceNotes from '@/components/invoices/InvoiceNotes';
import DeleteInvoiceDialog from '@/components/invoices/DeleteInvoiceDialog';
import InvoiceActions from '@/components/invoices/InvoiceActions';

// Import hooks and utilities
import { useInvoices } from '@/context/InvoicesContext';
import { exportToPdf } from '@/lib/invoice-utils';

const InvoiceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, deleteInvoice } = useInvoices();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  
  const invoice = getInvoiceById(id!);
  
  if (!invoice) {
    navigate('/');
    return null;
  }
  
  const handleExportPdf = () => {
    try {
      exportToPdf(invoice);
      toast.success('Invoice exported to PDF');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export invoice to PDF');
    }
  };
  
  const handleDelete = () => {
    deleteInvoice(invoice.id);
    navigate('/');
  };
  
  return (
    <div className="space-y-6">
      <InvoiceViewHeader 
        invoiceNumber={invoice.invoiceNumber}
        onEdit={() => navigate(`/create-invoice/${invoice.id}`)}
        onExportPdf={handleExportPdf}
        onDeleteClick={() => setShowDeleteDialog(true)}
      />
      
      <Card className="overflow-hidden">
        <InvoiceHeaderCard 
          invoiceNumber={invoice.invoiceNumber}
          status={invoice.status}
        />
        
        <CardContent className="p-8">
          <InvoicePartyInfo 
            company={invoice.company}
            client={invoice.client}
          />
          
          <InvoiceDateInfo 
            date={invoice.date}
            dueDate={invoice.dueDate}
            totalAmount={invoice.totalAmount}
            taxAmount={invoice.taxAmount}
          />
          
          <InvoiceItemsTable items={invoice.items} />
          
          <InvoiceTotals 
            totalAmount={invoice.totalAmount}
            taxRate={invoice.taxRate}
            taxAmount={invoice.taxAmount}
          />
          
          <InvoiceNotes notes={invoice.notes} />
        </CardContent>
        
        <CardFooter className="bg-invoice-lightGray p-8 flex justify-end">
          <InvoiceActions onExportPdf={handleExportPdf} />
        </CardFooter>
      </Card>
      
      <DeleteInvoiceDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
};

export default InvoiceView;
