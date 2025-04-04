
import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/invoice-utils';

interface InvoiceDateInfoProps {
  date: Date;
  dueDate: Date;
  totalAmount: number;
  taxAmount?: number;
}

const InvoiceDateInfo: React.FC<InvoiceDateInfoProps> = ({
  date,
  dueDate,
  totalAmount,
  taxAmount = 0,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div>
        <h3 className="font-medium text-invoice-gray mb-2">Invoice Date</h3>
        <p>{format(date, 'MMM dd, yyyy')}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-invoice-gray mb-2">Due Date</h3>
        <p>{format(dueDate, 'MMM dd, yyyy')}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-invoice-gray mb-2">Amount Due</h3>
        <p className="font-bold text-lg">{formatCurrency(totalAmount + taxAmount)}</p>
      </div>
    </div>
  );
};

export default InvoiceDateInfo;
