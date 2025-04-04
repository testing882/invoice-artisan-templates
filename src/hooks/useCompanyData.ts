
import { useState, useEffect } from 'react';
import { CompanyInfo } from '@/types/invoice';
import { fetchCompanyDetails, saveCompanyToDatabase } from '@/api/companyApi';

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

  // Load company details on initial render
  useEffect(() => {
    const loadCompanyDetails = async () => {
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
  }, []);

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
