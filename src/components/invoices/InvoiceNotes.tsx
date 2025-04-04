
import React from 'react';

interface InvoiceNotesProps {
  notes?: string;
}

const InvoiceNotes: React.FC<InvoiceNotesProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <div className="mt-8">
      <h3 className="font-medium text-invoice-gray mb-2">Notes</h3>
      <p className="text-invoice-darkGray">{notes}</p>
    </div>
  );
};

export default InvoiceNotes;
