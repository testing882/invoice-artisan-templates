
import React from 'react';
import { formatCurrency } from '@/lib/invoice-utils';

interface InvoiceTotalsProps {
  totalAmount: number;
  taxRate?: number;
  taxAmount?: number;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
  totalAmount,
  taxRate,
  taxAmount,
}) => {
  return (
    <div className="mt-8 flex justify-end">
      <div className="w-64 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Amount Paid:</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        
        {taxRate && taxAmount && (
          <div className="flex justify-between">
            <span>Tax ({taxRate}%):</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total:</span>
          <span>{formatCurrency(totalAmount + (taxAmount || 0))}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;
