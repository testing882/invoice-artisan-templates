
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isWithinInterval } from 'date-fns';
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
import { Download, Eye, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const Export: React.FC = () => {
  const { invoices } = useInvoice();
  const navigate = useNavigate();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const filteredInvoices = invoices.filter(invoice => {
    if (startDate && endDate) {
      return isWithinInterval(invoice.date, { start: startDate, end: endDate });
    } else if (startDate) {
      return invoice.date >= startDate;
    } else if (endDate) {
      return invoice.date <= endDate;
    }
    return true;
  });
  
  const handleSelect = (id: string) => {
    setSelectedInvoices(prev => 
      prev.includes(id) 
        ? prev.filter(invoiceId => invoiceId !== id)
        : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
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

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
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
      
      <div className="flex flex-wrap items-end gap-4 mb-4 p-4 bg-gray-50 rounded-md">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="ml-auto"
        >
          Clear Filters
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={filteredInvoices.length > 0 && selectedInvoices.length === filteredInvoices.length}
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
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
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
                  {startDate || endDate 
                    ? "No invoices found for the selected date range" 
                    : "No invoices created yet"}
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
