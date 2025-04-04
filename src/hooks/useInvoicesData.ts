
import { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';
import { 
  fetchInvoices, 
  addInvoiceToDatabase, 
  updateInvoiceInDatabase, 
  deleteInvoiceFromDatabase 
} from '@/api/invoiceApi';

export const useInvoicesData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load invoices on initial render
  useEffect(() => {
    const loadInvoices = async () => {
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
  }, []);

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
    getInvoiceById,
    loading,
    error,
  };
};
