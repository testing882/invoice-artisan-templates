
import { useState, useEffect } from 'react';
import { CompanyInfo } from '@/types/invoice';
import { fetchCompanyDetails, saveCompanyToDatabase } from '@/api/companyApi';
import { useAuth } from '@/context/AuthContext';

export const useCompanyData = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load company details when authentication state changes
  useEffect(() => {
    const loadCompanyDetails = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchCompanyDetails();
        if (data) {
          setCompanyInfo(data);
        }
        setError(null);
      } catch (err) {
        console.error('Error in useCompanyData:', err);
        setError('Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    loadCompanyDetails();
  }, [user]); // Depend on auth user state

  const saveCompany = async (company: CompanyInfo) => {
    try {
      setLoading(true);
      await saveCompanyToDatabase(company);
      // Update local state
      setCompanyInfo(company);
    } catch (err) {
      console.error('Error saving company in hook:', err);
      // Error is already handled and displayed in the API function
    } finally {
      setLoading(false);
    }
  };

  return {
    companyInfo,
    saveCompany,
    loading,
    error,
  };
};
