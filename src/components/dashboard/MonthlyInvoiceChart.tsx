
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
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Create a map to store monthly totals
    const monthMap = new Map<string, MonthlyData>();
    
    // Initialize all months for the current year with zero values
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
    
    // Sum invoice amounts by month
    invoices.forEach(invoice => {
      // Ensure date is valid
      if (!isValid(invoice.date)) return;
      
      // Only include invoices from the current year
      if (getYear(invoice.date) !== currentYear) return;
      
      const monthKey = format(invoice.date, 'yyyy-MM');
      const existingMonth = monthMap.get(monthKey);
      
      if (existingMonth) {
        existingMonth.value += invoice.totalAmount + (invoice.taxAmount || 0);
      }
    });
    
    // Convert map to array and sort by month
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
        <div className="h-[300px]">
          <ChartContainer
            config={chartConfig}
            className="h-full"
          >
            <LineChart data={monthlyData}>
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
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
