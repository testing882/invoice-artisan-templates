
import React from 'react';
import { formatCurrency } from '@/lib/invoice-utils';

interface InvoiceTotalsProps {
  totalAmount: number;
  taxRate?: number;
  taxAmount?: number;
  currency?: string;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
  totalAmount,
  taxRate,
  taxAmount,
  currency = 'USD' // Default to USD if no currency is provided
}) => {
  // Calculate total with tax if available
  const grandTotal = taxAmount ? totalAmount + taxAmount : totalAmount;
  
  return (
    <div className="mt-8 flex justify-end">
      <div className="w-64 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(totalAmount, currency)}</span>
        </div>
        
        {taxRate && taxAmount ? (
          <div className="flex justify-between">
            <span>Tax ({taxRate}%):</span>
            <span>{formatCurrency(taxAmount, currency)}</span>
          </div>
        ) : null}
        
        <div className="flex justify-between font-bold">
          <span>Amount Paid:</span>
          <span>{formatCurrency(grandTotal, currency)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;
