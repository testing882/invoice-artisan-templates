
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Download } from 'lucide-react';
import { useInvoices } from '@/context/InvoicesContext';
import { useTemplates } from '@/context/TemplatesContext';
import { formatCurrency } from '@/lib/invoice-utils';
import { format } from 'date-fns';
import { MonthlyInvoiceChart } from '@/components/dashboard/MonthlyInvoiceChart';
import { TopCustomersChart } from '@/components/dashboard/TopCustomersChart';

const Dashboard: React.FC = () => {
  const { invoices } = useInvoices();
  const { templates } = useTemplates();
  const navigate = useNavigate();
  
  const recentInvoices = invoices.slice(0, 5);
  
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => {
    const totalWithTax = invoice.totalAmount + (invoice.taxAmount || 0);
    return sum + totalWithTax;
  }, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-invoice-darkGray">Dashboard</h1>
        <Button 
          onClick={() => navigate('/create-invoice')}
          className="bg-invoice-blue hover:bg-invoice-darkBlue"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-invoice-gray">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{invoices.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-invoice-gray">Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{templates.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-invoice-gray">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalInvoiceAmount)}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Monthly Invoice Chart and Top Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyInvoiceChart invoices={invoices} />
        <TopCustomersChart invoices={invoices} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your most recent invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div 
                    key={invoice.id} 
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-invoice-lightGray cursor-pointer"
                    onClick={() => navigate(`/invoice/${invoice.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-invoice-blue" />
                      <div>
                        <p className="font-medium">{invoice.client.name}</p>
                        <p className="text-sm text-invoice-gray">{invoice.invoiceNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(invoice.totalAmount + (invoice.taxAmount || 0))}</p>
                      <p className="text-sm text-invoice-gray">{format(invoice.date, 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-invoice-gray">No invoices created yet</p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/create-invoice')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Invoice
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Company Templates</CardTitle>
            <CardDescription>Your saved company templates</CardDescription>
          </CardHeader>
          <CardContent>
            {templates.length > 0 ? (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div 
                    key={template.id} 
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-invoice-lightGray cursor-pointer"
                    onClick={() => navigate(`/templates/${template.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-invoice-blue flex items-center justify-center text-white font-medium">
                        {template.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-invoice-gray">{template.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/create-invoice?template=${template.id}`);
                      }}
                    >
                      Use
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-invoice-gray">No templates created yet</p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/templates/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Template
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
