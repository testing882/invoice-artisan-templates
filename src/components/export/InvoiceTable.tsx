
import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Download, Edit, Eye, Trash, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/invoice-utils';
import { Invoice } from '@/types/invoice';

interface InvoiceTableProps {
  filteredInvoices: Invoice[];
  selectedInvoices: string[];
  handleSelect: (id: string) => void;
  handleSelectAll: () => void;
  handleExport: (id: string) => void;
  handleEdit?: (id: string) => void;
  handleDelete?: (id: string) => void;
  showRestore?: boolean;
  handleRestore?: (id: string) => void;
  deleteButtonText?: string;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  filteredInvoices,
  selectedInvoices,
  handleSelect,
  handleSelectAll,
  handleExport,
  handleEdit,
  handleDelete,
  showRestore = false,
  handleRestore,
  deleteButtonText = "Delete",
}) => {
  const navigate = useNavigate();
  const selectedCount = selectedInvoices.length;
  const totalCount = filteredInvoices.length;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={totalCount > 0 && selectedCount === totalCount}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                Invoice Number
                {selectedCount > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({selectedCount} selected)
                  </span>
                )}
              </TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={() => handleSelect(invoice.id)}
                    />
                  </TableCell>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.client.name}</TableCell>
                  <TableCell>{format(invoice.date, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(invoice.dueDate, 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : invoice.status === 'sent' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(invoice.totalAmount + (invoice.taxAmount || 0))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!showRestore && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/invoice/${invoice.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExport(invoice.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {handleEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(invoice.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}
                      
                      {showRestore && handleRestore && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestore(invoice.id)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {handleDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(invoice.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  {showRestore 
                    ? "No deleted invoices found" 
                    : (selectedInvoices.length > 0) 
                      ? "No invoices found for the selected filters" 
                      : "No invoices created yet"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceTable;
