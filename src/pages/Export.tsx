import React, { useState } from 'react';
import { isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useInvoices } from '@/context/InvoicesContext';
import { exportToPdf } from '@/lib/invoice-utils';
import { toast } from 'sonner';
import FilterSection from '@/components/export/FilterSection';
import InvoiceTable from '@/components/export/InvoiceTable';

const Export: React.FC = () => {
  const { invoices } = useInvoices();
  
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  
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
    if (selectedCompany && selectedCompany !== "all") {
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
    setSelectedCompany("all");
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
      
      <FilterSection 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        uniqueCompanies={uniqueCompanies}
        clearFilters={clearFilters}
      />
      
      <InvoiceTable 
        filteredInvoices={filteredInvoices}
        selectedInvoices={selectedInvoices}
        handleSelect={handleSelect}
        handleSelectAll={handleSelectAll}
        handleExport={handleExport}
      />
    </div>
  );
};

export default Export;
