
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '@/context/InvoiceContext';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { generateInvoiceNumber, calculateItemAmount } from '@/lib/invoice-utils';
import { CompanyTemplate, ClientInfo, Invoice } from '@/types/invoice';
import { Textarea } from '@/components/ui/textarea';

const BulkInvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { templates, addInvoice } = useInvoice();
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  const [companies, setCompanies] = useState<{ template: CompanyTemplate; amount: string }[]>([]);

  // Initialize companies from templates
  React.useEffect(() => {
    if (templates.length > 0 && companies.length === 0) {
      setCompanies(
        templates.map((template) => ({
          template,
          amount: '',
        }))
      );
    }
  }, [templates, companies.length]);

  const handleAmountChange = (index: number, value: string) => {
    const newCompanies = [...companies];
    newCompanies[index].amount = value;
    setCompanies(newCompanies);
  };

  const handleGenerateInvoices = () => {
    // Validate inputs
    if (!description.trim()) {
      toast.error('Please enter a description for the invoices');
      return;
    }

    const validCompanies = companies.filter(
      (company) => company.amount && !isNaN(parseFloat(company.amount)) && parseFloat(company.amount) > 0
    );

    if (validCompanies.length === 0) {
      toast.error('Please enter valid amounts for at least one company');
      return;
    }

    // Generate invoices
    let generatedCount = 0;

    validCompanies.forEach((company) => {
      const amount = parseFloat(company.amount);
      
      // Create invoice for each company with valid amount
      const invoiceItem = {
        id: crypto.randomUUID(),
        description: description,
        quantity: 1,
        rate: amount,
        amount: amount,
      };

      // Get your company details from localStorage
      const yourCompany: CompanyTemplate = {
        id: "your-company",
        name: localStorage.getItem('company_name') || 'Your Company',
        address: localStorage.getItem('company_street') || '',
        city: localStorage.getItem('company_city') || '',
        postalCode: localStorage.getItem('company_zipCode') || '',
        country: localStorage.getItem('company_country') || '',
        phone: '',
        email: localStorage.getItem('company_email') || '',
      };

      const newInvoice: Invoice = {
        id: crypto.randomUUID(),
        invoiceNumber: generateInvoiceNumber(),
        date: date,
        dueDate: addDays(date, 30),
        company: yourCompany,
        client: company.template as ClientInfo,
        items: [invoiceItem],
        notes: '',
        totalAmount: amount,
        status: 'draft',
      };

      addInvoice(newInvoice);
      generatedCount++;
    });

    if (generatedCount > 0) {
      toast.success(`Generated ${generatedCount} invoices successfully`);
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-invoice-darkGray">Bulk Invoice Creation</h1>
      </div>

      <div className="grid gap-6">
        <div className="space-y-4 p-6 bg-white rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold">Invoice Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="invoice-date">Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="invoice-date"
                    variant="outline"
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter service or product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none h-[80px]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Company Amounts</h2>
          </div>

          <div className="border rounded-md overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Company</TableHead>
                    <TableHead className="w-1/2">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.length > 0 ? (
                    companies.map((company, index) => (
                      <TableRow key={company.template.id}>
                        <TableCell className="font-medium">
                          {company.template.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={company.amount}
                              onChange={(e) => handleAmountChange(index, e.target.value)}
                              placeholder="0.00"
                              className="w-full md:w-32"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-10">
                        No company templates available. Create templates first.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleGenerateInvoices}
              className="bg-invoice-blue hover:bg-invoice-darkBlue w-full md:w-auto"
              disabled={companies.length === 0}
            >
              Bulk Generate Invoices
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkInvoicesPage;
