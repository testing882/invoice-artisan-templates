
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInvoice } from '@/context/InvoiceContext';
import { formatCurrency, exportToPdf } from '@/lib/invoice-utils';
import { Pencil, Download, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

const InvoiceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, deleteInvoice } = useInvoice();
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-invoice-darkGray">
          Invoice {invoice.invoiceNumber}
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/create-invoice/${invoice.id}`)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          <Button 
            className="bg-invoice-blue hover:bg-invoice-darkBlue"
            onClick={handleExportPdf}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="bg-invoice-blue p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold">INVOICE</h2>
              <p className="mt-1 text-white/80">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <div className="text-white/80">Status</div>
              <div className="mt-1 inline-block px-3 py-1 rounded-full bg-white text-invoice-blue font-semibold uppercase text-sm">
                {invoice.status}
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-medium text-invoice-gray mb-2">From</h3>
              <div className="space-y-1">
                <p className="font-bold text-lg">{invoice.company.name}</p>
                <p>{invoice.company.address}</p>
                <p>{invoice.company.city}, {invoice.company.postalCode}</p>
                <p>{invoice.company.country}</p>
                <p>{invoice.company.phone}</p>
                <p>{invoice.company.email}</p>
                {invoice.company.taxId && <p>Tax ID: {invoice.company.taxId}</p>}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-invoice-gray mb-2">Bill To</h3>
              <div className="space-y-1">
                <p className="font-bold text-lg">{invoice.client.name}</p>
                <p>{invoice.client.address}</p>
                <p>{invoice.client.city}, {invoice.client.postalCode}</p>
                <p>{invoice.client.country}</p>
                <p>{invoice.client.email}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <h3 className="font-medium text-invoice-gray mb-2">Invoice Date</h3>
              <p>{format(invoice.date, 'MMM dd, yyyy')}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-invoice-gray mb-2">Due Date</h3>
              <p>{format(invoice.dueDate, 'MMM dd, yyyy')}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-invoice-gray mb-2">Amount Due</h3>
              <p className="font-bold text-lg">{formatCurrency(invoice.totalAmount + (invoice.taxAmount || 0))}</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.rate)}</td>
                    <td>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
              
              {invoice.taxRate && invoice.taxAmount && (
                <div className="flex justify-between">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(invoice.totalAmount + (invoice.taxAmount || 0))}</span>
              </div>
            </div>
          </div>
          
          {(invoice.notes || invoice.terms) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {invoice.notes && (
                <div>
                  <h3 className="font-medium text-invoice-gray mb-2">Notes</h3>
                  <p className="text-invoice-darkGray">{invoice.notes}</p>
                </div>
              )}
              
              {invoice.terms && (
                <div>
                  <h3 className="font-medium text-invoice-gray mb-2">Terms & Conditions</h3>
                  <p className="text-invoice-darkGray">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-invoice-lightGray p-8 flex justify-end">
          <Button 
            className="bg-invoice-blue hover:bg-invoice-darkBlue"
            onClick={handleExportPdf}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this invoice. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceView;
