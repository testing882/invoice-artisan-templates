
import React from 'react';

interface InvoiceNotesProps {
  notes?: string;
}

const InvoiceNotes: React.FC<InvoiceNotesProps> = ({ notes }) => {
  if (!notes) return null;
  
  // Split notes by line breaks to create paragraphs
  const noteLines = notes.split('\n');
  
  return (
    <div className="mt-8 bg-invoice-lightGray/30 rounded-md p-4">
      <h3 className="font-medium text-invoice-gray mb-2">Notes</h3>
      <div className="text-invoice-darkGray space-y-2">
        {noteLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default InvoiceNotes;
