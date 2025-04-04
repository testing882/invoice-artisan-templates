
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
      </div>
    </div>
  );
};

export default InvoiceTotals;
