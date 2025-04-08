
import { Invoice, InvoiceItem } from '@/types/invoice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import JSZip from 'jszip';

export const calculateItemAmount = (item: InvoiceItem): number => {
  return item.quantity * item.rate;
};

export const calculateInvoiceTotal = (items: InvoiceItem[]): number => {
  return items.reduce((total, item) => total + calculateItemAmount(item), 0);
};

export const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100);
};

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const currencyConfig: Record<string, { code: string, symbol: string }> = {
    USD: { code: 'USD', symbol: '$' },
    EUR: { code: 'EUR', symbol: '€' }
  };
  
  const currency = currencyConfig[currencyCode] || currencyConfig.USD;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
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
  // Make sure to get the currency from the invoice or company or client, with a fallback to USD
  const currency = invoice.currency || invoice.company.currency || invoice.client.currency || 'USD';
  
  console.log('Using currency for PDF export:', currency);
  
  // Add invoice details
  doc.setFontSize(20);
  doc.text('INVOICE', 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 14, 35);
  doc.text(`Date: ${format(invoice.date, 'MMM dd, yyyy')}`, 14, 42);
  doc.text(`Due Date: ${format(invoice.dueDate, 'MMM dd, yyyy')}`, 14, 49);
  
  // Company info - ensure all fields are correctly handled
  doc.setFontSize(12);
  doc.text('From:', 14, 66);
  doc.setFontSize(10);
  
  // Always ensure company name is displayed
  const companyName = invoice.company?.name || 'Your Company';
  doc.text(companyName, 14, 73);
  
  // Track current Y position
  let yPos = 80;
  
  // Add address if it exists
  if (invoice.company?.address) {
    doc.text(invoice.company.address, 14, yPos);
    yPos += 7;
  }
  
  // Handle city and postal code
  let cityPostalLine = '';
  if (invoice.company?.city) {
    cityPostalLine += invoice.company.city;
    if (invoice.company?.postalCode) {
      cityPostalLine += `, ${invoice.company.postalCode}`;
    }
  } else if (invoice.company?.postalCode) {
    cityPostalLine = invoice.company.postalCode;
  }
  
  if (cityPostalLine) {
    doc.text(cityPostalLine, 14, yPos);
    yPos += 7;
  }
  
  // Add country if it exists
  if (invoice.company?.country) {
    doc.text(invoice.company.country, 14, yPos);
    yPos += 7;
  }
  
  // Add email if it exists
  if (invoice.company?.email) {
    doc.text(invoice.company.email, 14, yPos);
    yPos += 7;
  }
  
  // Add VAT number if it exists
  if (invoice.company?.vatNumber) {
    doc.text(`VAT: ${invoice.company.vatNumber}`, 14, yPos);
    yPos += 7;
  }
  
  // Client info
  doc.setFontSize(12);
  doc.text('Bill To:', 120, 66);
  doc.setFontSize(10);
  doc.text(invoice.client.name || '', 120, 73);
  
  // Reset Y position for client info
  yPos = 80;
  
  if (invoice.client.address) {
    doc.text(invoice.client.address, 120, yPos);
    yPos += 7;
  }
  
  // Handle city and postal code carefully for client
  let clientCityPostalLine = '';
  if (invoice.client.city) {
    clientCityPostalLine += invoice.client.city;
    if (invoice.client.postalCode) {
      clientCityPostalLine += `, ${invoice.client.postalCode}`;
    }
  } else if (invoice.client.postalCode) {
    clientCityPostalLine = invoice.client.postalCode;
  }
  
  if (clientCityPostalLine) {
    doc.text(clientCityPostalLine, 120, yPos);
    yPos += 7;
  }
  
  if (invoice.client.country) {
    doc.text(invoice.client.country, 120, yPos);
    yPos += 7;
  }
  
  // Add VAT number for client if it exists
  if (invoice.client.vatNumber) {
    doc.text(`VAT: ${invoice.client.vatNumber}`, 120, yPos);
    yPos += 7;
  }
  
  // Invoice items
  const tableColumn = ["Description", "Qty", "Rate", "Amount"];
  const tableRows = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.rate, currency),
    formatCurrency(item.amount, currency)
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
  
  // Calculate total with tax if available
  const totalWithTax = invoice.taxAmount ? invoice.totalAmount + invoice.taxAmount : invoice.totalAmount;
  
  // Add Subtotal, Tax (if applicable), and Amount Paid
  const labelX = 120; // Starting position for the labels
  const valueX = 170; // Position for the values (aligned right)
  
  // Subtotal
  doc.text(`Subtotal:`, labelX, finalY + 10);
  doc.text(`${formatCurrency(invoice.totalAmount, currency)}`, valueX, finalY + 10, { align: 'right' });
  
  // Tax if available
  let currentY = finalY + 10;
  if (invoice.taxRate && invoice.taxAmount) {
    currentY += 7;
    doc.text(`Tax (${invoice.taxRate}%):`, labelX, currentY);
    doc.text(`${formatCurrency(invoice.taxAmount, currency)}`, valueX, currentY, { align: 'right' });
  }
  
  // Amount Paid (Total)
  currentY += 7;
  doc.text(`Amount Paid:`, labelX, currentY);
  doc.text(`${formatCurrency(totalWithTax, currency)}`, valueX, currentY, { align: 'right' });
  
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
