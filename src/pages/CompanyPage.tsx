
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const COMPANY_STORAGE_KEY = 'invoiceArtisan_company';

interface CompanyInfo {
  name: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  email: string;
}

const CompanyPage: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
    email: '',
  });

  useEffect(() => {
    // Load existing values from localStorage
    try {
      const savedCompany = localStorage.getItem(COMPANY_STORAGE_KEY);
      if (savedCompany) {
        const parsedCompany = JSON.parse(savedCompany);
        setCompanyInfo(parsedCompany);
      } else {
        // If no saved data, check for individual fields (backward compatibility)
        setCompanyInfo({
          name: localStorage.getItem('company_name') || '',
          street: localStorage.getItem('company_street') || '',
          city: localStorage.getItem('company_city') || '',
          zipCode: localStorage.getItem('company_zipCode') || '',
          country: localStorage.getItem('company_country') || '',
          email: localStorage.getItem('company_email') || '',
        });
      }
    } catch (error) {
      console.error('Error loading company info:', error);
      toast.error('Failed to load company information');
    }
  }, []);

  const handleChange = (field: keyof CompanyInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = () => {
    try {
      // Save as a single JSON object
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(companyInfo));
      
      // Also save individual fields for backward compatibility
      localStorage.setItem('company_name', companyInfo.name);
      localStorage.setItem('company_street', companyInfo.street);
      localStorage.setItem('company_city', companyInfo.city);
      localStorage.setItem('company_zipCode', companyInfo.zipCode);
      localStorage.setItem('company_country', companyInfo.country);
      localStorage.setItem('company_email', companyInfo.email);
      
      toast.success('Company information saved successfully');
    } catch (error) {
      console.error('Error saving company info:', error);
      toast.error('Failed to save company information');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-invoice-darkGray">Your Company</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name"
                placeholder="Your company name"
                value={companyInfo.name}
                onChange={handleChange('name')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-street">Street Address</Label>
              <Input 
                id="company-street"
                placeholder="Street address"
                value={companyInfo.street}
                onChange={handleChange('street')}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-city">City</Label>
                <Input 
                  id="company-city"
                  placeholder="City"
                  value={companyInfo.city}
                  onChange={handleChange('city')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-zip">Zip/Postal Code</Label>
                <Input 
                  id="company-zip"
                  placeholder="Zip or postal code"
                  value={companyInfo.zipCode}
                  onChange={handleChange('zipCode')}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-country">Country</Label>
              <Input 
                id="company-country"
                placeholder="Country"
                value={companyInfo.country}
                onChange={handleChange('country')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input 
                id="company-email"
                type="email"
                placeholder="company@example.com"
                value={companyInfo.email}
                onChange={handleChange('email')}
              />
            </div>
            
            <Button 
              className="bg-invoice-blue hover:bg-invoice-darkBlue w-full"
              onClick={handleSave}
            >
              Save Company Information
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyPage;
