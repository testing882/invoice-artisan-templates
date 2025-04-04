
import { Invoice, InvoiceItem } from '@/types/invoice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import JSZip from 'jszip';

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

export const exportToPdf = (invoice: Invoice): jsPDF => {
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
  
  // Add Subtotal and Amount Paid only (no Total)
  // Making sure they align properly by using the same position for the labels
  const labelX = 120; // Starting position for the labels
  const valueX = 170; // Position for the values (aligned right)
  
  doc.text(`Subtotal:`, labelX, finalY + 10);
  doc.text(`${formatCurrency(invoice.totalAmount)}`, valueX, finalY + 10, { align: 'right' });
  
  doc.text(`Amount Paid:`, labelX, finalY + 17);
  doc.text(`${formatCurrency(invoice.totalAmount)}`, valueX, finalY + 17, { align: 'right' });
  
  // Add notes
  if (invoice.notes) {
    doc.setFontSize(11);
    doc.text('Notes:', 14, finalY + 40);
    doc.setFontSize(9);
    doc.text(invoice.notes, 14, finalY + 47);
  }
  
  return doc;
};

export const savePdfDocument = (doc: jsPDF, filename: string): void => {
  doc.save(filename);
};

export const getPdfAsBlob = (doc: jsPDF): Promise<Blob> => {
  return new Promise((resolve) => {
    const blob = doc.output('blob');
    resolve(blob);
  });
};

export const exportInvoicesToZip = async (
  invoices: Invoice[],
  zipFilename: string
): Promise<void> => {
  // Create a new JSZip instance
  const zip = new JSZip();
  
  // Process each invoice
  for (const invoice of invoices) {
    try {
      // Generate PDF document
      const pdfDoc = exportToPdf(invoice);
      
      // Get PDF as blob
      const pdfBlob = await getPdfAsBlob(pdfDoc);
      
      // Add PDF to zip
      zip.file(`Invoice-${invoice.invoiceNumber}.pdf`, pdfBlob);
    } catch (error) {
      console.error(`Error adding invoice ${invoice.invoiceNumber} to zip:`, error);
    }
  }
  
  // Generate and download the zip file
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = zipFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};

export const generateZipFilename = (invoices: Invoice[]): string => {
  // Default name
  let filename = "Invoices";
  
  if (invoices.length > 0) {
    // Get year and month from the first invoice
    const year = format(invoices[0].date, 'yyyy');
    const month = format(invoices[0].date, 'MMMM');
    
    // Check if all invoices are for the same client
    const firstClientName = invoices[0].client.name;
    const allSameClient = invoices.every(invoice => invoice.client.name === firstClientName);
    
    if (allSameClient) {
      // Format: YEAR_MONTH_CLIENTNAME_Invoices.zip
      filename = `${year}_${month}_${firstClientName}_Invoices`;
    } else {
      // Format: YEAR_MONTH_Invoices.zip
      filename = `${year}_${month}_Invoices`;
    }
  }
  
  return `${filename}.zip`;
};
