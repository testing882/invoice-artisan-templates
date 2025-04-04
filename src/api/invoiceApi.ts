
import { Invoice } from '@/types/invoice';
import { supabase } from '@/integrations/supabase/client';
import { mapInvoiceFromSupabase, mapInvoiceToSupabase } from '@/lib/invoiceSupabase';
import { getCurrentUserId } from '@/lib/supabase';
import { toast } from 'sonner';

// Function to fetch invoices from Supabase
export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    // Get current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.log('No authenticated user, returning empty invoices array');
      return [];
    }
    
    // Fetch invoices for the current user
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    console.log('Fetched invoices:', data);
    
    if (data && data.length > 0) {
      // Map invoices from Supabase format to application format
      return data.map(mapInvoiceFromSupabase);
    } else {
      // Return empty array if no invoices found
      console.log('No invoices found, returning empty array');
      return [];
    }
  } catch (err) {
    console.error('Error loading invoices:', err);
    toast.error('Failed to load invoices');
    
    // Return empty array in case of error
    return [];
  }
};

// Function to add an invoice to Supabase
export const addInvoiceToDatabase = async (invoice: Invoice): Promise<void> => {
  try {
    // Get current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to create invoices');
      return;
    }
    
    // Map invoice to Supabase format
    const supabaseInvoice = mapInvoiceToSupabase(invoice);
    
    // Insert invoice into Supabase
    const { error } = await supabase
      .from('invoices')
      .insert({
        ...supabaseInvoice,
        user_id: userId
      });
    
    if (error) {
      throw error;
    }
    
    toast.success('Invoice created successfully');
  } catch (err) {
    console.error('Error adding invoice:', err);
    toast.error('Failed to create invoice');
    throw err;
  }
};

// Function to update an invoice in Supabase
export const updateInvoiceInDatabase = async (invoice: Invoice): Promise<void> => {
  try {
    // Get current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to update invoices');
      return;
    }
    
    // Map invoice to Supabase format
    const supabaseInvoice = mapInvoiceToSupabase(invoice);
    
    // Update invoice in Supabase
    const { error } = await supabase
      .from('invoices')
      .update({
        ...supabaseInvoice,
        user_id: userId
      })
      .eq('id', invoice.id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Invoice updated successfully');
  } catch (err) {
    console.error('Error updating invoice:', err);
    toast.error('Failed to update invoice');
    throw err;
  }
};

// Function to delete an invoice from Supabase
export const deleteInvoiceFromDatabase = async (id: string): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to delete invoices');
      return;
    }
    
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Invoice deleted successfully');
  } catch (err) {
    console.error('Error deleting invoice:', err);
    toast.error('Failed to delete invoice');
    throw err;
  }
};
