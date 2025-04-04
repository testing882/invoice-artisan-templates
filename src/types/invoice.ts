
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface CompanyTemplate {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  logo?: string;
  taxId?: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  company: CompanyTemplate;
  client: ClientInfo;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  totalAmount: number;
  taxRate?: number;
  taxAmount?: number;
  status: 'draft' | 'sent' | 'paid';
}
