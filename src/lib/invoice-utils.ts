
import { Invoice, InvoiceItem } from '@/types/invoice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// By importing autotable separately, it will automatically extend jsPDF's prototype
// So we don't need to declare the module extension

export const calculateItemAmount = (item: InvoiceItem): number => {
  return item.quantity * item.rate;
};

export const calculateInvoiceTotal = (items: InvoiceItem[]): number => {
  return items.reduce((total, item) => total + calculateItemAmount(item), 0);
};

export const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  const date = format(new Date(), 'yyyyMMdd');
  return `${prefix}-${date}-${random}`;
};

export const exportToPdf = (invoice: Invoice): void => {
  const doc = new jsPDF();
  
  // Add company details
  doc.setFontSize(20);
  doc.text('INVOICE', 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 14, 35);
  doc.text(`Date: ${format(invoice.date, 'MMM dd, yyyy')}`, 14, 42);
  doc.text(`Due Date: ${format(invoice.dueDate, 'MMM dd, yyyy')}`, 14, 49);
  
  // Company info
  doc.setFontSize(12);
  doc.text('From:', 14, 66);
  doc.setFontSize(10);
  doc.text(invoice.company.name, 14, 73);
  doc.text(invoice.company.address, 14, 80);
  doc.text(`${invoice.company.city}, ${invoice.company.postalCode}`, 14, 87);
  doc.text(invoice.company.country, 14, 94);
  
  // Client info
  doc.setFontSize(12);
  doc.text('Bill To:', 120, 66);
  doc.setFontSize(10);
  doc.text(invoice.client.name, 120, 73);
  doc.text(invoice.client.address, 120, 80);
  doc.text(`${invoice.client.city}, ${invoice.client.postalCode}`, 120, 87);
  doc.text(invoice.client.country, 120, 94);
  
  // Invoice items
  const tableColumn = ["Description", "Qty", "Rate", "Amount"];
  const tableRows = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.rate),
    formatCurrency(item.amount)
  ]);
  
  // Add invoice items table using autoTable directly
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 110,
    theme: 'grid',
    styles: { 
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [14, 165, 233],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
  });
  
  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY || 110;
  
  // Add totals
  doc.text(`Subtotal:`, 140, finalY + 10);
  doc.text(`${formatCurrency(invoice.totalAmount)}`, 170, finalY + 10, { align: 'right' });
  
  if (invoice.taxRate && invoice.taxAmount) {
    doc.text(`Tax (${invoice.taxRate}%):`, 140, finalY + 17);
    doc.text(`${formatCurrency(invoice.taxAmount)}`, 170, finalY + 17, { align: 'right' });
    doc.text(`Total:`, 140, finalY + 24);
    doc.text(`${formatCurrency(invoice.totalAmount + invoice.taxAmount)}`, 170, finalY + 24, { align: 'right' });
  }
  
  // Add notes
  if (invoice.notes) {
    doc.setFontSize(11);
    doc.text('Notes:', 14, finalY + 40);
    doc.setFontSize(9);
    doc.text(invoice.notes, 14, finalY + 47);
  }
  
  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
};
