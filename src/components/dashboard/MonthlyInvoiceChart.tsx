import React, { useMemo } from 'react';
import { format, startOfMonth, parseISO, isValid, isSameMonth, getYear } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types/invoice';
import { formatCurrency } from '@/lib/invoice-utils';
import { ChartContainer } from '@/components/ui/chart';

interface MonthlyInvoiceChartProps {
  invoices: Invoice[];
}

interface MonthlyData {
  month: string;
  value: number;
  monthKey: string; // for sorting
}

export const MonthlyInvoiceChart: React.FC<MonthlyInvoiceChartProps> = ({ invoices }) => {
  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    const monthMap = new Map<string, MonthlyData>();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      const monthStr = format(date, 'MMM');
      const monthKey = format(date, 'yyyy-MM');
      
      monthMap.set(monthKey, {
        month: monthStr,
        value: 0,
        monthKey
      });
    }
    
    invoices.forEach(invoice => {
      if (!isValid(invoice.date)) return;
      
      if (getYear(invoice.date) !== currentYear) return;
      
      const monthKey = format(invoice.date, 'yyyy-MM');
      const existingMonth = monthMap.get(monthKey);
      
      if (existingMonth) {
        existingMonth.value += invoice.totalAmount + (invoice.taxAmount || 0);
      }
    });
    
    return Array.from(monthMap.values())
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [invoices]);

  const chartConfig = {
    invoices: {
      label: "Monthly Revenue",
      theme: {
        light: "#0EA5E9", // Using invoice-blue from tailwind config
        dark: "#BAE6FD", // Using invoice-lightBlue from tailwind config
      },
    },
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip border rounded-md shadow-md bg-background p-2 text-sm">
          <p className="text-xs text-muted-foreground">{payload[0].payload.month}</p>
          <p className="font-bold text-foreground">{formatCurrency(payload[0].value as number)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Invoice Revenue</CardTitle>
        <CardDescription>Total invoice values by month for {new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#888888' }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).split('.')[0]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#888888' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone"
                dataKey="value" 
                name="invoices"
                stroke="var(--color-invoices)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-invoices)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
