
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInvoice } from '@/context/InvoiceContext';
import { Invoice, InvoiceItem, CompanyTemplate, ClientInfo } from '@/types/invoice';
import { 
  calculateInvoiceTotal, 
  calculateTax, 
  generateInvoiceNumber,
  calculateItemAmount,
  formatCurrency,
} from '@/lib/invoice-utils';

const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().email("Invalid email address"),
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
  terms: z.string().optional(),
  taxRate: z.coerce.number().min(0, "Tax rate cannot be negative").optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  initialData?: Invoice;
  onSubmit: (data: Invoice) => void;
  templateId?: string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, onSubmit, templateId }) => {
  const { templates } = useInvoice();
  
  // Initialize an empty invoice item
  const emptyItem: InvoiceItem = {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    rate: 0,
    amount: 0,
  };
  
  // Set default values based on initial data or create new ones
  const defaultValues = initialData ? {
    invoiceNumber: initialData.invoiceNumber,
    date: initialData.date,
    dueDate: initialData.dueDate,
    companyId: initialData.company.id,
    client: initialData.client,
    items: initialData.items,
    notes: initialData.notes || '',
    terms: initialData.terms || '',
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
      email: '',
    },
    items: [emptyItem],
    notes: '',
    terms: '',
    taxRate: 0,
  };
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
  });
  
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
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
      amount: calculateItemAmount(item),
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
  
  const handleAddItem = () => {
    append({
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    });
  };
  
  const handleSubmit = (values: InvoiceFormValues) => {
    const selectedCompany = templates.find(t => t.id === values.companyId)!;
    
    const invoice: Invoice = {
      id: initialData?.id || crypto.randomUUID(),
      invoiceNumber: values.invoiceNumber,
      date: values.date,
      dueDate: values.dueDate,
      company: selectedCompany,
      client: values.client as ClientInfo,
      items: values.items.map(item => ({
        ...item,
        amount: calculateItemAmount(item),
        id: item.id || crypto.randomUUID(),
        description: item.description,
        quantity: item.quantity,
        rate: item.rate
      })) as InvoiceItem[],
      notes: values.notes,
      terms: values.terms,
      totalAmount: subtotal,
      taxRate: values.taxRate,
      taxAmount: taxAmount,
      status: initialData?.status || 'draft',
    };
    
    onSubmit(invoice);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Invoice Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MMM dd, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "MMM dd, yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Company Template */}
        <div>
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Company</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company template" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Client Information Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="client.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="client.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Invoice Items Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Invoice Items</h2>
            <Button 
              type="button" 
              onClick={handleAddItem}
              className="bg-invoice-blue hover:bg-invoice-darkBlue"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full invoice-table">
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td>
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" step="0.01" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td>
                      <FormField
                        control={form.control}
                        name={`items.${index}.rate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" step="0.01" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td>
                      <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <div className="pt-2 text-invoice-darkGray">
                            {formatCurrency(field.value)}
                          </div>
                        )}
                      />
                    </td>
                    <td>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fields.length > 1 && remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span>Tax Rate:</span>
                <div className="w-20">
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <span>%</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notes and Terms Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information for the client..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms & Conditions</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Payment terms, conditions, etc..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button type="submit" className="bg-invoice-blue hover:bg-invoice-darkBlue">
            {initialData ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
