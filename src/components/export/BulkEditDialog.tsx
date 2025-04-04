
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useInvoices } from '@/context/InvoicesContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoiceIds: string[];
}

interface BulkEditFormData {
  date?: Date;
  dueDate?: Date;
  notes?: string;
}

const BulkEditDialog: React.FC<BulkEditDialogProps> = ({ 
  open, 
  onOpenChange,
  selectedInvoiceIds
}) => {
  const { invoices, bulkUpdateInvoices } = useInvoices();
  const [formData, setFormData] = useState<BulkEditFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Reset form when dialog opens/closes
    if (!open) {
      setFormData({});
    }
  }, [open]);
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, date }));
  };
  
  const handleDueDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }));
  };
  
  const handleSubmit = async () => {
    // Validate that at least one field is set
    if (!formData.date && !formData.dueDate && (!formData.notes || formData.notes.trim() === '')) {
      toast.error('Please update at least one field');
      return;
    }
    
    // Get the selected invoices
    const selectedInvoices = selectedInvoiceIds
      .map(id => invoices.find(inv => inv.id === id))
      .filter(Boolean);
    
    if (selectedInvoices.length === 0) {
      toast.error('No valid invoices found to update');
      onOpenChange(false);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await bulkUpdateInvoices(selectedInvoiceIds, formData);
      toast.success(`Successfully updated ${selectedInvoiceIds.length} invoice(s)`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating invoices:', error);
      toast.error('Failed to update invoices');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const selectionSummary = selectedInvoiceIds.length > 0 
    ? `Editing ${selectedInvoiceIds.length} invoice${selectedInvoiceIds.length > 1 ? 's' : ''}`
    : 'No invoices selected';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Edit Invoices</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 text-sm text-muted-foreground">
          {selectionSummary}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Invoice Date (optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Due Date (optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={handleDueDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <Textarea 
              placeholder="Update notes for all selected invoices..."
              className="resize-none"
              value={formData.notes || ''}
              onChange={handleNotesChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Invoices"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditDialog;
