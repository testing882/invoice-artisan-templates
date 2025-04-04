
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { InvoiceFormValues } from '@/hooks/useInvoiceForm';
import { useInvoice } from '@/context/InvoiceContext';
import { Users } from 'lucide-react';

interface ClientInfoFormProps {
  form: UseFormReturn<InvoiceFormValues>;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({ form }) => {
  const { templates } = useInvoice();

  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    
    if (selectedTemplate) {
      // Update form with selected template data
      form.setValue('client.name', selectedTemplate.name);
      form.setValue('client.address', selectedTemplate.address);
      form.setValue('client.city', selectedTemplate.city);
      form.setValue('client.postalCode', selectedTemplate.postalCode);
      form.setValue('client.country', selectedTemplate.country);
      
      // If template has a description, set it for the first item
      if (selectedTemplate.description && form.getValues('items')[0]) {
        form.setValue('items.0.description', selectedTemplate.description);
      }
      
      // If company is not in EU, set tax rate to 0
      if (!selectedTemplate.isEU) {
        form.setValue('taxRate', 0);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Client Information</h2>
      </div>

      <div className="space-y-6">
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
        
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        
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
  );
};

export default ClientInfoForm;
