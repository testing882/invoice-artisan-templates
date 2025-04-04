
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  isBulkDelete?: boolean;
  count?: number;
  permanentDelete?: boolean;
}

const DeleteInvoiceDialog: React.FC<DeleteInvoiceDialogProps> = ({
  open,
  onOpenChange,
  onConfirmDelete,
  isBulkDelete = false,
  count = 1,
  permanentDelete = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {permanentDelete ? (
              isBulkDelete 
                ? `This will permanently delete ${count} selected invoice${count !== 1 ? 's' : ''}. This action cannot be undone.`
                : 'This will permanently delete this invoice. This action cannot be undone.'
            ) : (
              isBulkDelete 
                ? `This will move ${count} selected invoice${count !== 1 ? 's' : ''} to trash. Invoices in trash will be deleted permanently after 30 days.`
                : 'This will move this invoice to trash. Invoices in trash will be deleted permanently after 30 days.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground">
            {permanentDelete ? 'Delete Permanently' : 'Move to Trash'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInvoiceDialog;
