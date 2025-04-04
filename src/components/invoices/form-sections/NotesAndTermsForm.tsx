
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from 'react-hook-form';
import { InvoiceFormValues } from '@/hooks/useInvoiceForm';

interface NotesAndTermsFormProps {
  form: UseFormReturn<InvoiceFormValues>;
}

const NotesAndTermsForm: React.FC<NotesAndTermsFormProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
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
    </div>
  );
};

export default NotesAndTermsForm;
