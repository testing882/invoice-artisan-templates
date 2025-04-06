
import React from 'react';
import { useFormContext, useFieldArray } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from '@/lib/invoice-utils';
import { InvoiceFormValues } from '@/hooks/useInvoiceForm';

interface InvoiceItemsFormProps {
  form: any;
  subtotal: number;
  taxAmount: number;
  total: number;
}

const InvoiceItemsForm: React.FC<InvoiceItemsFormProps> = ({ form, subtotal, taxAmount, total }) => {
  const { control, register, formState: { errors } } = useFormContext<InvoiceFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Create a new empty item
  const addNewItem = () => {
    append({
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    });
  };
  
  return (
    <div className="p-6 bg-white rounded-lg border shadow-sm space-y-6">
      <h2 className="text-xl font-semibold">Invoice Items</h2>
      
      <div className="space-y-4">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-invoice-darkGray">
          <div className="col-span-5">Description</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Rate</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1"></div>
        </div>
        
        {/* Item rows */}
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-4 items-start">
            {/* Description */}
            <div className="col-span-5">
              <FormField
                control={control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="resize-none h-[80px]" 
                        placeholder="Enter item description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Quantity */}
            <div className="col-span-2">
              <FormField
                control={control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Qty"
                        // Convert to string for the input value
                        value={field.value.toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Rate */}
            <div className="col-span-2">
              <FormField
                control={control}
                name={`items.${index}.rate`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Rate"
                        // Convert to string for the input value
                        value={field.value.toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Amount (calculated) */}
            <div className="col-span-2">
              <FormField
                control={control}
                name={`items.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled
                        className="bg-gray-50 cursor-not-allowed"
                        value={formatCurrency(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Delete button */}
            <div className="col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                  }
                }}
                disabled={fields.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {/* Add item button */}
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={addNewItem}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
        
        {/* Tax and total section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-invoice-gray">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              
              <FormField
                control={control}
                name="taxRate"
                render={({ field }) => (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FormLabel className="m-0 text-invoice-gray">Tax Rate:</FormLabel>
                      <FormControl>
                        <div className="relative w-16">
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="pr-6 text-right"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2">%</span>
                        </div>
                      </FormControl>
                    </div>
                    <span className="font-medium">{formatCurrency(taxAmount)}</span>
                  </div>
                )}
              />
              
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold">Total:</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItemsForm;
