import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from 'lucide-react';
import { InvoiceItem } from '@/types/invoice';
import { formatCurrency, calculateItemAmount } from '@/lib/invoice-utils';
import { InvoiceFormValues } from '@/hooks/useInvoiceForm';

interface InvoiceItemsFormProps {
  form: UseFormReturn<InvoiceFormValues>;
  subtotal: number;
  taxAmount: number;
  total: number;
}

const InvoiceItemsForm: React.FC<InvoiceItemsFormProps> = ({ 
  form, 
  subtotal, 
  taxAmount, 
  total 
}) => {
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });
  
  const handleAddItem = () => {
    append({
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    });
  };

  return (
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
  );
};

export default InvoiceItemsForm;
