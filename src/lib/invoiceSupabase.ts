
import { Invoice } from '@/types/invoice';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { getCurrentUserId } from './supabase';

// Define a type for invoices from Supabase
export type SupabaseInvoice = Database['public']['Tables']['invoices']['Row'];

// Convert snake_case from DB to camelCase for frontend
export const mapInvoiceFromSupabase = (invoice: SupabaseInvoice): Invoice => ({
  id: invoice.id,
  invoiceNumber: invoice.invoice_number,
  company: invoice.company as any,
  client: invoice.client as any,
  items: invoice.items as any,
  notes: invoice.notes || '',
  status: invoice.status as 'draft' | 'sent' | 'paid',
  date: new Date(invoice.date),
  dueDate: new Date(invoice.due_date),
  totalAmount: Number(invoice.total_amount),
  taxRate: invoice.tax_rate ? Number(invoice.tax_rate) : undefined,
  taxAmount: invoice.tax_amount ? Number(invoice.tax_amount) : undefined,
  deleted: invoice.deleted || false,
  deletedAt: invoice.deleted_at ? new Date(invoice.deleted_at) : undefined,
});

// Convert camelCase from frontend to snake_case for DB
export const mapInvoiceToSupabase = (invoice: Invoice): Omit<SupabaseInvoice, 'created_at' | 'user_id'> => ({
  id: invoice.id,
  invoice_number: invoice.invoiceNumber,
  company: invoice.company as any,
  client: invoice.client as any,
  items: invoice.items as any,
  notes: invoice.notes || null,
  status: invoice.status,
  date: invoice.date.toISOString(),
  due_date: invoice.dueDate.toISOString(),
  total_amount: invoice.totalAmount,
  tax_rate: invoice.taxRate || null,
  tax_amount: invoice.taxAmount || null,
  deleted: invoice.deleted || false,
  deleted_at: invoice.deletedAt ? invoice.deletedAt.toISOString() : null,
});
