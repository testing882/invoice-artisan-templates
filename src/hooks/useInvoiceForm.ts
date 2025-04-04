
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
  companyId: z.string().min(1, "Please select a company template"),
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

interface UseInvoiceFormProps {
  initialData?: Invoice;
  templates: CompanyTemplate[];
  templateId?: string;
}

export const useInvoiceForm = ({ initialData, templates, templateId }: UseInvoiceFormProps) => {
  // Set default values based on initial data or create new ones
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
    companyId: templateId || (templates.length > 0 ? templates[0].id : ''),
    client: {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    } as ClientInfo,
    items: [createEmptyItem()],
    notes: '',
    taxRate: 0,
  };
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
  });
  
  const watchedItems = form.watch('items');
  const watchedTaxRate = form.watch('taxRate');
  
  // Calculate totals whenever items or tax rate change
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const calculatedItems = watchedItems.map(item => ({
      ...item,
      amount: calculateItemAmount({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount
      }),
    }));
    
    // Update form with recalculated amounts
    calculatedItems.forEach((item, index) => {
      if (item.amount !== watchedItems[index].amount) {
        form.setValue(`items.${index}.amount`, item.amount);
      }
    });
    
    const calculatedSubtotal = calculateInvoiceTotal(calculatedItems as InvoiceItem[]);
    setSubtotal(calculatedSubtotal);
    
    const calculatedTaxAmount = calculateTax(calculatedSubtotal, watchedTaxRate || 0);
    setTaxAmount(calculatedTaxAmount);
    
    setTotal(calculatedSubtotal + calculatedTaxAmount);
  }, [watchedItems, watchedTaxRate, form]);

  const createInvoiceFromFormData = (values: InvoiceFormValues): Invoice => {
    const selectedCompany = templates.find(t => t.id === values.companyId)!;
    
    return {
      id: initialData?.id || crypto.randomUUID(),
      invoiceNumber: values.invoiceNumber,
      date: values.date,
      dueDate: values.dueDate,
      company: selectedCompany,
      client: values.client,
      items: values.items.map(item => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: calculateItemAmount({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        })
      })),
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
