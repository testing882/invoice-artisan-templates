
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types/invoice';
import { formatCurrency } from '@/lib/invoice-utils';

interface TopCustomersChartProps {
  invoices: Invoice[];
  limit?: number;
}

interface CustomerData {
  name: string;
  total: number;
  percentage: number;
}

export const TopCustomersChart: React.FC<TopCustomersChartProps> = ({ 
  invoices, 
  limit = 5 
}) => {
  const topCustomers = useMemo(() => {
    // Group invoices by client name and calculate totals
    const customerMap = new Map<string, CustomerData>();
    
    let grandTotal = 0;
    
    // Calculate total amount for each customer
    invoices.forEach(invoice => {
      const clientName = invoice.client.name;
      const invoiceTotal = invoice.totalAmount + (invoice.taxAmount || 0);
      grandTotal += invoiceTotal;
      
      if (customerMap.has(clientName)) {
        const existing = customerMap.get(clientName)!;
        existing.total += invoiceTotal;
      } else {
        customerMap.set(clientName, {
          name: clientName,
          total: invoiceTotal,
          percentage: 0
        });
      }
    });
    
    // Calculate percentage of total for each customer
    customerMap.forEach(customer => {
      customer.percentage = grandTotal > 0 ? (customer.total / grandTotal) * 100 : 0;
    });
    
    // Convert to array, sort by total and take top N
    return Array.from(customerMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }, [invoices, limit]);

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Revenue breakdown by customer</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-invoice-gray">No invoices created yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>Revenue breakdown by customer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.map((customer) => (
            <div key={customer.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">{customer.name}</span>
                <span className="text-invoice-gray text-sm">{formatCurrency(customer.total)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-invoice-blue h-2.5 rounded-full" 
                  style={{ width: `${customer.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
