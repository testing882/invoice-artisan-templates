
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useInvoice } from '@/context/InvoiceContext';
import { formatCurrency, exportToPdf } from '@/lib/invoice-utils';
import { Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

const Export: React.FC = () => {
  const { invoices } = useInvoice();
  const navigate = useNavigate();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  
  const handleSelect = (id: string) => {
    setSelectedInvoices(prev => 
      prev.includes(id) 
        ? prev.filter(invoiceId => invoiceId !== id)
        : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoices.map(invoice => invoice.id));
    }
  };
  
  const handleExport = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      try {
        exportToPdf(invoice);
        toast.success(`Exported ${invoice.invoiceNumber} to PDF`);
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        toast.error(`Failed to export ${invoice.invoiceNumber}`);
      }
    }
  };
  
  const handleBulkExport = () => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice to export');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    selectedInvoices.forEach(id => {
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice) {
        try {
          exportToPdf(invoice);
          successCount++;
        } catch (error) {
          console.error(`Error exporting ${invoice.invoiceNumber}:`, error);
          errorCount++;
        }
      }
    });
    
    if (successCount > 0) {
      toast.success(`Successfully exported ${successCount} invoice(s)`);
    }
    
    if (errorCount > 0) {
      toast.error(`Failed to export ${errorCount} invoice(s)`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-invoice-darkGray">Export Invoices</h1>
        <Button 
          onClick={handleBulkExport}
          className="bg-invoice-blue hover:bg-invoice-darkBlue"
          disabled={selectedInvoices.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Selected
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={() => handleSelect(invoice.id)}
                    />
                  </TableCell>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.client.name}</TableCell>
                  <TableCell>{format(invoice.date, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(invoice.dueDate, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : invoice.status === 'sent' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(invoice.totalAmount + (invoice.taxAmount || 0))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/invoice/${invoice.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExport(invoice.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No invoices created yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Export;
