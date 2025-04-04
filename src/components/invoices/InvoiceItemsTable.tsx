
import React from 'react';
import { InvoiceItem } from '@/types/invoice';
import { formatCurrency } from '@/lib/invoice-utils';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ items }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{formatCurrency(item.rate)}</td>
              <td>{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceItemsTable;
