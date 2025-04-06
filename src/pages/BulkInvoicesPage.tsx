
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '@/context/InvoicesContext';
import { useTemplates } from '@/context/TemplatesContext';
import { useCompany } from '@/context/CompanyContext';
import { generateInvoiceNumber } from '@/lib/invoice-utils';
import { CompanyTemplate, ClientInfo, Invoice } from '@/types/invoice';
import { toast } from 'sonner';
import InvoiceDetailsForm from '@/components/bulk-invoices/InvoiceDetailsForm';
import CompanyAmountsTable from '@/components/bulk-invoices/CompanyAmountsTable';

const BulkInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { templates } = useTemplates();
  const { addInvoice } = useInvoices();
  const { companyInfo } = useCompany();
  const [date, setDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [globalDescription, setGlobalDescription] = useState<string>('');
  const [companies, setCompanies] = useState<{ 
    template: CompanyTemplate; 
    amount: string;
    description: string; 
  }[]>([]);

  useEffect(() => {
    if (templates.length > 0 && companies.length === 0) {
      // Sort templates alphabetically by name before setting companies state
      const sortedTemplates = [...templates].sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      
      setCompanies(
        sortedTemplates.map((template) => ({
          template,
          amount: '',
          description: template.description || '',
        }))
      );
    }
  }, [templates, companies.length]);

  const handleAmountChange = (index: number, value: string) => {
    const newCompanies = [...companies];
    newCompanies[index].amount = value;
    setCompanies(newCompanies);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newCompanies = [...companies];
    newCompanies[index].description = value;
    setCompanies(newCompanies);
  };

  // Create a company template from company context data
  const createCompanyFromContext = (): CompanyTemplate => {
    return {
      id: "your-company",
      name: companyInfo.name || 'Your Company',
      address: companyInfo.street || '',
      city: companyInfo.city || '',
      postalCode: companyInfo.zipCode || '',
      country: companyInfo.country || '',
      phone: '',
      email: companyInfo.email || '',
      taxId: '',
      vatNumber: ''
    };
  };

  const handleGenerateInvoices = () => {
    const validCompanies = companies.filter(
      (company) => company.amount && !isNaN(parseFloat(company.amount)) && parseFloat(company.amount) > 0
    );

    if (validCompanies.length === 0) {
      toast.error('Please enter valid amounts for at least one company');
      return;
    }

    let generatedCount = 0;
    
    // Get your company info from the context instead of localStorage
    const yourCompany = createCompanyFromContext();

    validCompanies.forEach((company) => {
      const amount = parseFloat(company.amount);
      
      // Use global description if provided, otherwise use company-specific description
      const itemDescription = globalDescription.trim() 
        ? globalDescription 
        : company.description;
      
      const invoiceItem = {
        id: crypto.randomUUID(),
        description: itemDescription,
        quantity: 1,
        rate: amount,
        amount: amount,
      };

      const newInvoice: Invoice = {
        id: crypto.randomUUID(),
        invoiceNumber: generateInvoiceNumber(),
        date: date,
        dueDate: dueDate,
        company: yourCompany,
        client: company.template as ClientInfo,
        items: [invoiceItem],
        notes: '',
        totalAmount: amount,
        status: 'paid', // Always set status to paid for all invoices
      };

      addInvoice(newInvoice);
      generatedCount++;
    });

    if (generatedCount > 0) {
      toast.success(`Generated ${generatedCount} invoices successfully`);
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-invoice-darkGray">Bulk Invoice Creation</h1>
      </div>

      <div className="grid gap-6">
        <InvoiceDetailsForm 
          date={date}
          setDate={setDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
          description={globalDescription}
          setDescription={setGlobalDescription}
        />

        <CompanyAmountsTable 
          companies={companies}
          onAmountChange={handleAmountChange}
          onDescriptionChange={handleDescriptionChange}
          onGenerateInvoices={handleGenerateInvoices}
        />
      </div>
    </div>
  );
};

export default BulkInvoicesPage;
