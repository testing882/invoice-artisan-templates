
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface InvoiceActionsProps {
  onExportPdf: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  onExportPdf,
}) => {
  return (
    <Button 
      className="bg-invoice-blue hover:bg-invoice-darkBlue"
      onClick={onExportPdf}
    >
      <Download className="w-4 h-4 mr-2" />
      Export PDF
    </Button>
  );
};

export default InvoiceActions;
