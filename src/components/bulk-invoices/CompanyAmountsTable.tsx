
import React from 'react';
import { CompanyTemplate } from '@/types/invoice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CompanyAmountEntry {
  template: CompanyTemplate;
  amount: string;
  description: string;
  currency: string; // Add currency field
}

interface CompanyAmountsTableProps {
  companies: CompanyAmountEntry[];
  onAmountChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
  onCurrencyChange: (index: number, value: string) => void; // Add currency change handler
  onGenerateInvoices: () => void;
}

const CompanyAmountsTable: React.FC<CompanyAmountsTableProps> = ({
  companies,
  onAmountChange,
  onDescriptionChange,
  onCurrencyChange,
  onGenerateInvoices,
}) => {
  // Sort companies alphabetically by name
  const sortedCompanies = [...companies].sort((a, b) => 
    a.template.name.localeCompare(b.template.name)
  );

  // Available currencies
  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
  ];

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Company Amounts</h2>
      </div>

      <div className="border rounded-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Company</TableHead>
                <TableHead className="w-2/5">Description</TableHead>
                <TableHead className="w-1/5">Amount</TableHead>
                <TableHead className="w-1/5">Currency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompanies.length > 0 ? (
                sortedCompanies.map((company, index) => (
                  <TableRow key={company.template.id}>
                    <TableCell className="font-medium">
                      {company.template.name}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={company.description}
                        onChange={(e) => onDescriptionChange(
                          // Find the original index in companies array
                          companies.findIndex(c => c.template.id === company.template.id),
                          e.target.value
                        )}
                        placeholder="Description of services"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={company.amount}
                        onChange={(e) => onAmountChange(
                          // Find the original index in companies array
                          companies.findIndex(c => c.template.id === company.template.id),
                          e.target.value
                        )}
                        placeholder="0.00"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={company.currency}
                        onValueChange={(value) => onCurrencyChange(
                          // Find the original index in companies array
                          companies.findIndex(c => c.template.id === company.template.id),
                          value
                        )}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
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
          onClick={onGenerateInvoices}
          className="bg-invoice-blue hover:bg-invoice-darkBlue w-full md:w-auto"
          disabled={sortedCompanies.length === 0}
        >
          Bulk Generate Invoices
        </Button>
      </div>
    </div>
  );
};

export default CompanyAmountsTable;
