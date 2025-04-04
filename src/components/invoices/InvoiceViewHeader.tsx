
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil, Download, Trash } from 'lucide-react';

interface InvoiceViewHeaderProps {
  invoiceNumber: string;
  onEdit: () => void;
  onExportPdf: () => void;
  onDeleteClick: () => void;
}

const InvoiceViewHeader: React.FC<InvoiceViewHeaderProps> = ({
  invoiceNumber,
  onEdit,
  onExportPdf,
  onDeleteClick,
}) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-invoice-darkGray">
        Invoice {invoiceNumber}
      </h1>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onEdit}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        
        <Button 
          className="bg-invoice-blue hover:bg-invoice-darkBlue"
          onClick={onExportPdf}
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        
        <Button 
          variant="destructive"
          onClick={onDeleteClick}
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default InvoiceViewHeader;
