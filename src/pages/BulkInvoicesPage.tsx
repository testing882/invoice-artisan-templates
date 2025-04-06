
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '@/context/InvoicesContext';
import { useTemplates } from '@/context/TemplatesContext';
import { generateInvoiceNumber } from '@/lib/invoice-utils';
import { CompanyTemplate, ClientInfo, Invoice } from '@/types/invoice';
import { toast } from 'sonner';
import InvoiceDetailsForm from '@/components/bulk-invoices/InvoiceDetailsForm';
import CompanyAmountsTable from '@/components/bulk-invoices/CompanyAmountsTable';

const BulkInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { templates } = useTemplates();
  const { addInvoice } = useInvoices();
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

  // Create a company template from localStorage data
  const createCompanyFromLocalStorage = (): CompanyTemplate => {
    const COMPANY_STORAGE_KEY = 'invoiceArtisan_company';
    
    try {
      // First try to load from the consolidated storage
      const savedCompany = localStorage.getItem(COMPANY_STORAGE_KEY);
      
      if (savedCompany) {
        const parsedCompany = JSON.parse(savedCompany);
        return {
          id: "your-company",
          name: parsedCompany.name || 'Your Company',
          address: parsedCompany.street || '',
          city: parsedCompany.city || '',
          postalCode: parsedCompany.zipCode || '',
          country: parsedCompany.country || '',
          phone: '',
          email: parsedCompany.email || '',
          taxId: '',
          vatNumber: ''
        };
      }
      
      // Fallback to individual fields
      return {
        id: "your-company",
        name: localStorage.getItem('company_name') || 'Your Company',
        address: localStorage.getItem('company_street') || '',
        city: localStorage.getItem('company_city') || '',
        postalCode: localStorage.getItem('company_zipCode') || '',
        country: localStorage.getItem('company_country') || '',
        phone: '',
        email: localStorage.getItem('company_email') || '',
        taxId: '',
        vatNumber: ''
      };
    } catch (error) {
      console.error('Error creating company from localStorage:', error);
      
      // Return a default company if there's an error
      return {
        id: "your-company",
        name: 'Your Company',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
        email: '',
        taxId: '',
        vatNumber: ''
      };
    }
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
    
    // Get your company info from localStorage
    const yourCompany = createCompanyFromLocalStorage();

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
