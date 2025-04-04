
import React from 'react';

interface InvoiceHeaderCardProps {
  invoiceNumber: string;
  status: string;
}

const InvoiceHeaderCard: React.FC<InvoiceHeaderCardProps> = ({
  invoiceNumber,
  status,
}) => {
  return (
    <div className="bg-invoice-blue p-8 text-white">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">INVOICE</h2>
          <p className="mt-1 text-white/80">#{invoiceNumber}</p>
        </div>
        <div className="text-right">
          <div className="text-white/80">Status</div>
          <div className="mt-1 inline-block px-3 py-1 rounded-full bg-white text-invoice-blue font-semibold uppercase text-sm">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeaderCard;
