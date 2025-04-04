
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from 'react-hook-form';

interface InvoiceFormValues {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  companyId: string;
  client: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    email: string;
  };
  items: {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  notes?: string;
  terms?: string;
  taxRate?: number;
}

interface NotesAndTermsFormProps {
  form: UseFormReturn<InvoiceFormValues>;
}

const NotesAndTermsForm: React.FC<NotesAndTermsFormProps> = ({ form }) => {
  return (
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
  );
};

export default NotesAndTermsForm;
