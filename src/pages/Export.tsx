
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
import { Download, Eye, CalendarIcon, Building, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Export: React.FC = () => {
  const { invoices } = useInvoice();
  const navigate = useNavigate();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  
  // Get unique client company names for the filter
  const uniqueCompanies = React.useMemo(() => {
    const companies = invoices.map(invoice => invoice.client.name);
    return Array.from(new Set(companies)).sort();
  }, [invoices]);
  
  const filteredInvoices = invoices.filter(invoice => {
    let dateCondition = true;
    if (startDate && endDate) {
      dateCondition = isWithinInterval(invoice.date, { start: startDate, end: endDate });
    } else if (startDate) {
      dateCondition = invoice.date >= startDate;
    } else if (endDate) {
      dateCondition = invoice.date <= endDate;
    }
    
    let companyCondition = true;
    if (selectedCompany) {
      companyCondition = invoice.client.name === selectedCompany;
    }
    
    return dateCondition && companyCondition;
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
    setSelectedCompany("");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-invoice-darkGray">Export Invoices</h1>
        <Button 
          onClick={handleBulkExport}
          className="bg-invoice-blue hover:bg-invoice-darkBlue w-full md:w-auto"
          disabled={selectedInvoices.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Selected
        </Button>
      </div>
      
      <div className="bg-gray-50 rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter Invoices
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
                    "w-full justify-start text-left font-normal",
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
          
          <div className="space-y-2">
            <Label htmlFor="company-filter">Client Company</Label>
            <Select 
              value={selectedCompany}
              onValueChange={setSelectedCompany}
            >
              <SelectTrigger id="company-filter" className="w-full">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Companies</SelectItem>
                {uniqueCompanies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="w-full md:w-auto"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
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
                  <TableCell colSpan={8} className="text-center py-10">
                    {(startDate || endDate || selectedCompany) 
                      ? "No invoices found for the selected filters" 
                      : "No invoices created yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Export;
