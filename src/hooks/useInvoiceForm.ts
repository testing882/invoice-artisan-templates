
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  calculateInvoiceTotal, 
  calculateTax, 
  generateInvoiceNumber,
  calculateItemAmount 
} from '@/lib/invoice-utils';
import { Invoice, InvoiceItem, CompanyTemplate, ClientInfo } from '@/types/invoice';

// Schema definitions
const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
  rate: z.coerce.number().min(0.01, "Rate must be greater than 0"),
  amount: z.coerce.number(),
});

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.date(),
  dueDate: z.date(),
  companyId: z.string().min(1, "Company is required"),
  client: clientSchema,
  items: z.array(invoiceItemSchema).nonempty("At least one item is required"),
  notes: z.string().optional(),
  taxRate: z.coerce.number().min(0, "Tax rate cannot be negative").optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

// Empty invoice item template
const createEmptyItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  rate: 0,
  amount: 0,
});

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
    };
  }
};

interface UseInvoiceFormProps {
  initialData?: Invoice;
  templates: CompanyTemplate[];
  templateId?: string;
}

export const useInvoiceForm = ({ initialData, templates, templateId }: UseInvoiceFormProps) => {
  // Find selected template if templateId is provided
  const selectedTemplate = templateId 
    ? templates.find(t => t.id === templateId) 
    : undefined;
  
  // Set default values based on initial data, selected template, or create new ones
  const defaultValues = initialData ? {
    invoiceNumber: initialData.invoiceNumber,
    date: initialData.date,
    dueDate: initialData.dueDate,
    companyId: initialData.company.id,
    client: initialData.client,
    items: initialData.items,
    notes: initialData.notes || '',
    taxRate: initialData.taxRate || 0,
  } : {
    invoiceNumber: generateInvoiceNumber(),
    date: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    companyId: selectedTemplate?.id || "your-company",
    client: selectedTemplate ? {
      name: selectedTemplate.name,
      address: selectedTemplate.address,
      city: selectedTemplate.city,
      postalCode: selectedTemplate.postalCode,
      country: selectedTemplate.country,
    } : {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    } as ClientInfo,
    items: [createEmptyItem()],
    notes: selectedTemplate?.notes || '',
    taxRate: selectedTemplate?.isEU ? 20 : 0, // Default tax rate for EU companies
  };
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
  });
  
  // Set form values when template is selected
  useEffect(() => {
    if (selectedTemplate && !initialData) {
      // Update form values based on selected template
      form.setValue('companyId', selectedTemplate.id);
      
      // Update client information
      form.setValue('client.name', selectedTemplate.name);
      form.setValue('client.address', selectedTemplate.address);
      form.setValue('client.city', selectedTemplate.city);
      form.setValue('client.postalCode', selectedTemplate.postalCode);
      form.setValue('client.country', selectedTemplate.country);
      
      // Set default description to first item if available
      if (form.getValues('items').length > 0 && selectedTemplate.description) {
        form.setValue('items.0.description', selectedTemplate.description);
      }
      
      // Set notes if available
      if (selectedTemplate.notes) {
        form.setValue('notes', selectedTemplate.notes);
      }
      
      // Set tax rate if EU
      if (selectedTemplate.isEU) {
        form.setValue('taxRate', 20); // Default EU VAT rate
      } else {
        form.setValue('taxRate', 0);
      }
    }
  }, [selectedTemplate, form, initialData]);
  
  const watchedItems = form.watch('items');
  const watchedTaxRate = form.watch('taxRate');
  
  // Calculate totals whenever items or tax rate change
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const calculatedItems = watchedItems.map(item => {
      // Ensure we're working with numbers even if the form has string values
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const calculatedAmount = quantity * rate;
      
      return {
        ...item,
        quantity,
        rate,
        amount: calculatedAmount,
      };
    });
    
    // Update form with recalculated amounts
    calculatedItems.forEach((item, index) => {
      form.setValue(`items.${index}.amount`, item.amount, { 
        shouldValidate: false,
        shouldDirty: true
      });
    });
    
    const calculatedSubtotal = calculatedItems.reduce((sum, item) => sum + item.amount, 0);
    setSubtotal(calculatedSubtotal);
    
    const calculatedTaxAmount = calculateTax(calculatedSubtotal, watchedTaxRate || 0);
    setTaxAmount(calculatedTaxAmount);
    
    setTotal(calculatedSubtotal + calculatedTaxAmount);
  }, [watchedItems, watchedTaxRate, form]);

  const createInvoiceFromFormData = (values: InvoiceFormValues): Invoice => {
    // If it's the user's company from localStorage, create it from localStorage data
    const company = values.companyId === "your-company" 
      ? createCompanyFromLocalStorage() 
      : templates.find(t => t.id === values.companyId) || createCompanyFromLocalStorage();
    
    return {
      id: initialData?.id || crypto.randomUUID(),
      invoiceNumber: values.invoiceNumber,
      date: values.date,
      dueDate: values.dueDate,
      company: company,
      client: {
        name: values.client.name,
        address: values.client.address,
        city: values.client.city,
        postalCode: values.client.postalCode,
        country: values.client.country,
      },
      items: values.items.map(item => {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        return {
          id: item.id,
          description: item.description,
          quantity: quantity,
          rate: rate,
          amount: quantity * rate // Calculate amount directly here to ensure consistency
        };
      }),
      notes: values.notes,
      totalAmount: subtotal,
      taxRate: values.taxRate,
      taxAmount: taxAmount,
      status: initialData?.status || 'draft',
    };
  };
  
  return {
    form,
    subtotal,
    taxAmount,
    total,
    createInvoiceFromFormData
  };
};
