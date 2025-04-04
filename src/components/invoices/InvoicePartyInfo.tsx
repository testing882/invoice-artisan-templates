
import React from 'react';
import { CompanyTemplate, ClientInfo } from '@/types/invoice';

interface InvoicePartyInfoProps {
  company: CompanyTemplate;
  client: ClientInfo;
}

const InvoicePartyInfo: React.FC<InvoicePartyInfoProps> = ({
  company,
  client,
}) => {
  // Ensure proper formatting for company address display
  const formatCompanyAddress = () => {
    if (!company) return null;
    
    return (
      <div className="space-y-1">
        <p className="font-bold text-lg">{company.name || ''}</p>
        {company.address && <p>{company.address}</p>}
        <p>
          {company.city || ''}
          {company.city && company.postalCode ? ', ' : ''}
          {company.postalCode || ''}
        </p>
        {company.country && <p>{company.country}</p>}
        {company.email && <p className="mt-2">{company.email}</p>}
        {company.phone && <p>{company.phone}</p>}
        {company.taxId && <p className="mt-1">Tax ID: {company.taxId}</p>}
        {company.vatNumber && <p>VAT: {company.vatNumber}</p>}
      </div>
    );
  };

  // Ensure proper formatting for client address display
  const formatClientAddress = () => {
    if (!client) return null;
    
    return (
      <div className="space-y-1">
        <p className="font-bold text-lg">{client.name || ''}</p>
        {client.address && <p>{client.address}</p>}
        <p>
          {client.city || ''}
          {client.city && client.postalCode ? ', ' : ''}
          {client.postalCode || ''}
        </p>
        {client.country && <p>{client.country}</p>}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div>
        <h3 className="font-medium text-invoice-gray mb-2">From</h3>
        {formatCompanyAddress()}
      </div>
      
      <div>
        <h3 className="font-medium text-invoice-gray mb-2">Bill To</h3>
        {formatClientAddress()}
      </div>
    </div>
  );
};

export default InvoicePartyInfo;
