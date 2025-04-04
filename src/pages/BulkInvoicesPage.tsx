
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useInvoice } from '@/context/InvoiceContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { generateInvoiceNumber } from '@/lib/invoice-utils';

const BulkInvoicesPage: React.FC = () => {
  const { templates, addInvoice } = useInvoice();
  const navigate = useNavigate();
  
  // State for the common fields
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  
  // State for company-specific amounts
  const [companyAmounts, setCompanyAmounts] = useState<Record<string, number>>(
    templates.reduce((acc, template) => ({ ...acc, [template.id]: 0 }), {})
  );

  // Function to update the amount for a specific company
  const updateAmount = (companyId: string, amount: string) => {
    setCompanyAmounts(prev => ({
      ...prev,
      [companyId]: parseFloat(amount) || 0
    }));
  };

  // Function to generate bulk invoices
  const generateBulkInvoices = () => {
    if (!description) {
      toast.error('Please provide a description for the invoices');
      return;
    }

    const generatedCount = Object.entries(companyAmounts)
      .filter(([_, amount]) => amount > 0)
      .length;
    
    if (generatedCount === 0) {
      toast.error('Please add at least one amount greater than 0');
      return;
    }

    // Generate invoices for each company with amount > 0
    Object.entries(companyAmounts).forEach(([companyId, amount]) => {
      if (amount > 0) {
        const template = templates.find(t => t.id === companyId);
        
        if (template) {
          const invoice = {
            id: crypto.randomUUID(),
            invoiceNumber: generateInvoiceNumber(),
            date: date,
            dueDate: new Date(new Date(date).setDate(date.getDate() + 30)),
            company: template,
            client: {
              name: 'Your Company',
              address: localStorage.getItem('company_street') || '',
              city: localStorage.getItem('company_city') || '',
              postalCode: localStorage.getItem('company_zipCode') || '',
              country: localStorage.getItem('company_country') || '',
            },
            items: [
              {
                id: crypto.randomUUID(),
                description: description,
                quantity: 1,
                rate: amount,
                amount: amount,
              }
            ],
            totalAmount: amount,
            taxRate: 0,
            taxAmount: 0,
            status: 'draft',
          };
          
          addInvoice(invoice);
        }
      }
    });
    
    toast.success(`Generated ${generatedCount} invoices successfully`);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-invoice-darkGray">Bulk Invoices</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Multiple Invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Common fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Invoice Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description (for all invoices)</label>
              <Input
                id="description"
                placeholder="e.g., Monthly Services"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          {/* Company amounts table */}
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Company</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="w-40"
                          value={companyAmounts[template.id] || ''}
                          onChange={(e) => updateAmount(template.id, e.target.value)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Button 
            onClick={generateBulkInvoices}
            className="bg-invoice-blue hover:bg-blue-700 text-white"
            size="lg"
          >
            Bulk Generate Invoices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkInvoicesPage;
