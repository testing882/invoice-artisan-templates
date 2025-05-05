
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface InvoiceDetailsFormProps {
  date: Date;
  setDate: (date: Date) => void;
  dueDate: Date;
  setDueDate: (date: Date) => void;
  description: string;
  setDescription: (description: string) => void;
}

const InvoiceDetailsForm: React.FC<InvoiceDetailsFormProps> = ({
  date,
  setDate,
  dueDate,
  setDueDate,
  description,
  setDescription,
}) => {
  // Update due date when invoice date changes - set it to exactly the same date
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setDueDate(newDate); // Set due date to be the same as invoice date
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold">Invoice Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="invoice-date">Invoice Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="invoice-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="due-date">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="due-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => date && setDueDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">
            Global Description <span className="text-sm text-muted-foreground">(optional - overrides template descriptions)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Enter service or product description (will override template descriptions)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;
