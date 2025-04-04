
import React, { useState } from 'react';
import { isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Download, FileArchive, Trash } from 'lucide-react';
import { useInvoices } from '@/context/InvoicesContext';
import { exportToPdf, savePdfDocument, exportInvoicesToZip, generateZipFilename } from '@/lib/invoice-utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import FilterSection from '@/components/export/FilterSection';
import InvoiceTable from '@/components/export/InvoiceTable';
import DeleteInvoiceDialog from '@/components/invoices/DeleteInvoiceDialog';
import { useTemplates } from '@/context/TemplatesContext';

const Export: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, deleteInvoice } = useInvoices();
  const { templates } = useTemplates();
  
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  
  // Get unique client company names from invoices that match templates
  const uniqueCompanies = React.useMemo(() => {
    // Get all template names for comparison
    const templateNames = templates.map(template => template.name);
    
    // Filter invoice client names to only include those that match template names
    const companies = invoices
      .filter(invoice => templateNames.includes(invoice.company.name))
      .map(invoice => invoice.client.name);
    
    return Array.from(new Set(companies)).sort();
  }, [invoices, templates]);
  
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
        const pdfDoc = exportToPdf(invoice);
        savePdfDocument(pdfDoc, `Invoice-${invoice.invoiceNumber}.pdf`);
        toast.success(`Exported ${invoice.invoiceNumber} to PDF`);
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        toast.error(`Failed to export ${invoice.invoiceNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
  
  const handleBulkExport = () => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice to export');
      return;
    }
    
    // Get selected invoices
    const selectedInvoiceObjects = selectedInvoices
      .map(id => invoices.find(inv => inv.id === id))
      .filter(invoice => invoice !== undefined) as Invoice[];
    
    if (selectedInvoiceObjects.length === 0) {
      toast.error('No valid invoices found to export');
      return;
    }
    
    // Generate zip filename
    const zipFilename = generateZipFilename(selectedInvoiceObjects);
    
    // Export invoices to zip
    try {
      exportInvoicesToZip(selectedInvoiceObjects, zipFilename);
      toast.success(`Exporting ${selectedInvoiceObjects.length} invoice(s) as ${zipFilename}`);
    } catch (error) {
      console.error('Error exporting to zip:', error);
      toast.error(`Failed to export invoices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/create-invoice/${id}`);
  };

  const handleDelete = (id: string) => {
    setInvoiceToDelete(id);
    setBulkDelete(false);
    setShowDeleteDialog(true);
  };

  const handleBulkDelete = () => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice to delete');
      return;
    }
    
    setBulkDelete(true);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (bulkDelete) {
        // Delete all selected invoices
        const deletionPromises = selectedInvoices.map(id => deleteInvoice(id));
        await Promise.all(deletionPromises);
        setSelectedInvoices([]);
        toast.success(`Successfully deleted ${selectedInvoices.length} invoice(s)`);
      } else if (invoiceToDelete) {
        // Delete single invoice
        await deleteInvoice(invoiceToDelete);
        // Remove from selected invoices if it was selected
        setSelectedInvoices(prev => prev.filter(id => id !== invoiceToDelete));
        toast.success('Invoice deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting invoice(s):', error);
      toast.error(bulkDelete ? 'Failed to delete some invoices' : 'Failed to delete invoice');
    } finally {
      setInvoiceToDelete(null);
      setBulkDelete(false);
      setShowDeleteDialog(false);
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
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button 
            onClick={handleBulkExport}
            className="bg-invoice-blue hover:bg-invoice-darkBlue"
            disabled={selectedInvoices.length === 0}
          >
            <FileArchive className="w-4 h-4 mr-2" />
            Export as ZIP
          </Button>
          <Button 
            onClick={handleBulkDelete}
            variant="destructive"
            className="w-full sm:w-auto"
            disabled={selectedInvoices.length === 0}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
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
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <DeleteInvoiceDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={confirmDelete}
        isBulkDelete={bulkDelete}
        count={bulkDelete ? selectedInvoices.length : 1}
      />
    </div>
  );
};

export default Export;
