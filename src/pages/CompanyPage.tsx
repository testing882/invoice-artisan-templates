
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CompanyPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyStreet, setCompanyStreet] = useState('');
  const [companyCity, setCompanyCity] = useState('');
  const [companyZipCode, setCompanyZipCode] = useState('');
  const [companyCountry, setCompanyCountry] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  useEffect(() => {
    // Load existing values from localStorage
    setCompanyName(localStorage.getItem('company_name') || '');
    setCompanyStreet(localStorage.getItem('company_street') || '');
    setCompanyCity(localStorage.getItem('company_city') || '');
    setCompanyZipCode(localStorage.getItem('company_zipCode') || '');
    setCompanyCountry(localStorage.getItem('company_country') || '');
    setCompanyEmail(localStorage.getItem('company_email') || '');
  }, []);

  const handleSave = () => {
    // Save values to localStorage
    localStorage.setItem('company_name', companyName);
    localStorage.setItem('company_street', companyStreet);
    localStorage.setItem('company_city', companyCity);
    localStorage.setItem('company_zipCode', companyZipCode);
    localStorage.setItem('company_country', companyCountry);
    localStorage.setItem('company_email', companyEmail);
    
    toast.success('Company information saved successfully');
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
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-street">Street Address</Label>
              <Input 
                id="company-street"
                placeholder="Street address"
                value={companyStreet}
                onChange={(e) => setCompanyStreet(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-city">City</Label>
                <Input 
                  id="company-city"
                  placeholder="City"
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-zip">Zip/Postal Code</Label>
                <Input 
                  id="company-zip"
                  placeholder="Zip or postal code"
                  value={companyZipCode}
                  onChange={(e) => setCompanyZipCode(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-country">Country</Label>
              <Input 
                id="company-country"
                placeholder="Country"
                value={companyCountry}
                onChange={(e) => setCompanyCountry(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input 
                id="company-email"
                type="email"
                placeholder="company@example.com"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
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
