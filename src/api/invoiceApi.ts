
import { Invoice } from '@/types/invoice';
import { supabase } from '@/integrations/supabase/client';
import { mapInvoiceFromSupabase, mapInvoiceToSupabase, SupabaseInvoice } from '@/lib/invoiceSupabase';
import { getCurrentUserId } from '@/lib/supabase';
import { toast } from 'sonner';

interface BulkUpdateData {
  date?: Date;
  dueDate?: Date;
  notes?: string;
}

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
      return data.map(invoice => {
        const mappedInvoice = mapInvoiceFromSupabase(invoice as SupabaseInvoice);
        
        // Add deleted status
        mappedInvoice.deleted = invoice.deleted || false;
        if (invoice.deleted_at) {
          mappedInvoice.deletedAt = new Date(invoice.deleted_at);
        }
        
        return mappedInvoice;
      });
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
        user_id: userId,
        deleted: false
      } as unknown as SupabaseInvoice);
    
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
      } as unknown as SupabaseInvoice)
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

// Function to delete an invoice from Supabase (hard delete)
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

// Function to soft delete an invoice (mark as deleted)
export const softDeleteInvoiceInDatabase = async (id: string): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to delete invoices');
      return;
    }
    
    const { error } = await supabase
      .from('invoices')
      .update({
        deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
  } catch (err) {
    console.error('Error soft deleting invoice:', err);
    toast.error('Failed to move invoice to trash');
    throw err;
  }
};

// Function to permanently delete an invoice
export const permanentlyDeleteInvoiceInDatabase = async (id: string): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to delete invoices');
      return;
    }
    
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
  } catch (err) {
    console.error('Error permanently deleting invoice:', err);
    toast.error('Failed to delete invoice permanently');
    throw err;
  }
};

// Function to restore a soft-deleted invoice
export const restoreInvoiceInDatabase = async (id: string): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to restore invoices');
      return;
    }
    
    const { error } = await supabase
      .from('invoices')
      .update({
        deleted: false,
        deleted_at: null
      })
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
  } catch (err) {
    console.error('Error restoring invoice:', err);
    toast.error('Failed to restore invoice');
    throw err;
  }
};

// Function to bulk update invoices
export const bulkUpdateInvoicesInDatabase = async (ids: string[], data: BulkUpdateData): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error('You must be logged in to update invoices');
      return;
    }
    
    // Prepare update data
    const updateData: Record<string, any> = {};
    
    if (data.date) updateData.date = data.date.toISOString();
    if (data.dueDate) updateData.due_date = data.dueDate.toISOString();
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    // No updates to make
    if (Object.keys(updateData).length === 0) {
      return;
    }
    
    // Update each invoice one by one
    for (const id of ids) {
      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) {
        console.error(`Error updating invoice ${id}:`, error);
      }
    }
  } catch (err) {
    console.error('Error bulk updating invoices:', err);
    toast.error('Failed to update invoices');
    throw err;
  }
};
