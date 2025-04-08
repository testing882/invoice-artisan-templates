
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CompanyTemplate } from '@/types/invoice';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const templateSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().email("Invalid email").optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  taxId: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  logo: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  isEU: z.boolean().default(false),
  vatNumber: z.string().optional().or(z.literal('')),
  currency: z.string().default('USD'),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  initialData?: CompanyTemplate;
  onSubmit: (data: CompanyTemplate) => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ initialData, onSubmit }) => {
  console.log('Initial template data:', initialData);
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      address: initialData.address,
      city: initialData.city,
      postalCode: initialData.postalCode,
      country: initialData.country,
      email: initialData.email || '',
      phone: initialData.phone || '',
      taxId: initialData.taxId || '',
      description: initialData.description || '',
      logo: initialData.logo || '',
      notes: initialData.notes || '',
      isEU: initialData.isEU || false,
      vatNumber: initialData.vatNumber || '',
      currency: initialData.currency || 'USD',
    } : {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      email: '',
      phone: '',
      taxId: '',
      description: '',
      logo: '',
      notes: '',
      isEU: false,
      vatNumber: '',
      currency: 'USD',
    },
  });

  // Watch the isEU field to conditionally show VAT input
  const isEU = form.watch('isEU');

  const handleSubmit = (values: TemplateFormValues) => {
    console.log('Form values on submit:', values);
    
    const template: CompanyTemplate = {
      id: initialData?.id || crypto.randomUUID(),
      name: values.name,
      address: values.address,
      city: values.city,
      postalCode: values.postalCode,
      country: values.country,
      email: values.email || '',
      phone: values.phone || '',
      taxId: values.taxId || '',
      logo: values.logo || '',
      description: values.description || '',
      notes: values.notes || '',
      isEU: values.isEU || false,
      vatNumber: values.vatNumber || '',
      currency: values.currency,
    };
    
    console.log('Generated template:', template);
    onSubmit(template);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Business St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Anytown" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="USA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Description</FormLabel>
                <FormControl>
                  <Input placeholder="Service description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Notes field - added for payment instructions */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Payment instructions or additional information to display on invoices" 
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
          name="isEU"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Company is in EU region (applies tax)</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {/* VAT Number field - only shown when isEU is checked */}
        {isEU && (
          <FormField
            control={form.control}
            name="vatNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VAT Number</FormLabel>
                <FormControl>
                  <Input placeholder="EU VAT Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end gap-4">
          <Button type="submit" className="bg-invoice-blue hover:bg-invoice-darkBlue">
            {initialData ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TemplateForm;
