
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, Trash } from 'lucide-react';
import { exportToPdf, savePdfDocument } from '@/lib/invoice-utils';
import { Invoice } from '@/types/invoice';

interface InvoiceActionsProps {
  onExportPdf: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showEditDelete?: boolean;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  onExportPdf,
  onEdit,
  onDelete,
  showEditDelete = false,
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        className="bg-invoice-blue hover:bg-invoice-darkBlue"
        onClick={onExportPdf}
      >
        <Download className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
      
      {showEditDelete && (
        <>
          {onEdit && (
            <Button 
              variant="outline"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default InvoiceActions;
