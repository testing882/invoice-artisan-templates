
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { CompanyInfo } from '@/types/invoice';
import { useCompany } from '@/context/CompanyContext';

const CompanyPage: React.FC = () => {
  const { companyInfo: initialCompany, saveCompany, loading } = useCompany();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
    email: '',
  });

  useEffect(() => {
    if (initialCompany) {
      setCompanyInfo(initialCompany);
    }
  }, [initialCompany]);

  const handleChange = (field: keyof CompanyInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = async () => {
    await saveCompany(companyInfo);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <LoaderCircle className="w-10 h-10 text-invoice-blue animate-spin" />
        <p className="text-invoice-gray">Loading company details...</p>
      </div>
    );
  }

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
