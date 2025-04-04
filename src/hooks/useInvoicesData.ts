
import { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';
import { 
  fetchInvoices, 
  addInvoiceToDatabase, 
  updateInvoiceInDatabase, 
  deleteInvoiceFromDatabase,
  softDeleteInvoiceInDatabase,
  permanentlyDeleteInvoiceInDatabase,
  restoreInvoiceInDatabase,
  bulkUpdateInvoicesInDatabase
} from '@/api/invoiceApi';
import { useAuth } from '@/context/AuthContext';

interface BulkUpdateData {
  date?: Date;
  dueDate?: Date;
  notes?: string;
}

export const useInvoicesData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load invoices when authentication state changes
  useEffect(() => {
    const loadInvoices = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchInvoices();
        setInvoices(data);
        setError(null);
      } catch (err) {
        console.error('Error in useInvoicesData:', err);
        setError('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [user]); // Depend on auth user state

  const addInvoice = async (invoice: Invoice) => {
    try {
      setLoading(true);
      await addInvoiceToDatabase(invoice);
      // Update local state
      setInvoices((prev) => [...prev, invoice]);
    } catch (err) {
      console.error('Error adding invoice in hook:', err);
      // Error is already handled and displayed in the API function
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (invoice: Invoice) => {
    try {
      setLoading(true);
      await updateInvoiceInDatabase(invoice);
      // Update local state
      setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? invoice : inv)));
    } catch (err) {
      console.error('Error updating invoice in hook:', err);
      // Error is already handled and displayed in the API function
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      await deleteInvoiceFromDatabase(id);
      // Update local state
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (err) {
      console.error('Error deleting invoice in hook:', err);
      // Error is already handled and displayed in the API function
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const softDeleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      await softDeleteInvoiceInDatabase(id);
      // Update local state - mark as deleted
      setInvoices((prev) => 
        prev.map((invoice) => 
          invoice.id === id ? { ...invoice, deleted: true, deletedAt: new Date() } : invoice
        )
      );
    } catch (err) {
      console.error('Error soft deleting invoice in hook:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const permanentlyDeleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      await permanentlyDeleteInvoiceInDatabase(id);
      // Update local state
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (err) {
      console.error('Error permanently deleting invoice in hook:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const restoreInvoice = async (id: string) => {
    try {
      setLoading(true);
      await restoreInvoiceInDatabase(id);
      // Update local state - remove deleted flag
      setInvoices((prev) => 
        prev.map((invoice) => 
          invoice.id === id ? { ...invoice, deleted: false, deletedAt: undefined } : invoice
        )
      );
    } catch (err) {
      console.error('Error restoring invoice in hook:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const bulkUpdateInvoices = async (ids: string[], data: BulkUpdateData) => {
    try {
      setLoading(true);
      await bulkUpdateInvoicesInDatabase(ids, data);
      
      // Update local state
      setInvoices((prev) => 
        prev.map((invoice) => {
          if (ids.includes(invoice.id)) {
            const updatedInvoice = { ...invoice };
            
            if (data.date) updatedInvoice.date = data.date;
            if (data.dueDate) updatedInvoice.dueDate = data.dueDate;
            if (data.notes !== undefined) updatedInvoice.notes = data.notes;
            
            return updatedInvoice;
          }
          return invoice;
        })
      );
    } catch (err) {
      console.error('Error bulk updating invoices in hook:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  return {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    softDeleteInvoice,
    permanentlyDeleteInvoice,
    restoreInvoice,
    bulkUpdateInvoices,
    getInvoiceById,
    loading,
    error,
  };
};
