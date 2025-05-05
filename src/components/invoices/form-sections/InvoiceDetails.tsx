
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompanyTemplate } from '@/types/invoice';
import { UseFormReturn } from 'react-hook-form';
import { InvoiceFormValues } from '@/hooks/useInvoiceForm';
import { Card, CardContent } from '@/components/ui/card';
import { useCompany } from '@/context/CompanyContext';

interface InvoiceDetailsProps {
  form: UseFormReturn<InvoiceFormValues>;
  templates: CompanyTemplate[];
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ form }) => {
  const { companyInfo, loading } = useCompany();
  
  useEffect(() => {
    // Set the company ID in the form to ensure it uses your company data
    form.setValue('companyId', 'your-company');
    console.log('Company info from context:', companyInfo);
  }, [form, companyInfo]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-invoice-blue" />
            <h3 className="text-sm font-semibold">Your Company</h3>
          </div>
          {loading ? (
            <div className="text-sm text-gray-500">Loading company details...</div>
          ) : (
            <div className="text-sm text-gray-500">
              <p className="font-medium">{companyInfo.name || 'Company name not set'}</p>
              {companyInfo.street && <p>{companyInfo.street}</p>}
              <p>
                {companyInfo.city || ''}
                {companyInfo.city && companyInfo.zipCode ? ', ' : ''}
                {companyInfo.zipCode || ''}
              </p>
              {companyInfo.country && <p>{companyInfo.country}</p>}
              {companyInfo.email && <p className="mt-1">{companyInfo.email}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetails;
