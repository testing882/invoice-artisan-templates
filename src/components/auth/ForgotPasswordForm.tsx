
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onCancel }) => {
  const { resetPassword } = useAuth();
  const [resetInProgress, setResetInProgress] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetInProgress(true);
    setErrorMessage(null);
    
    try {
      const { error } = await resetPassword(resetEmail);
      if (error) {
        setErrorMessage(error.message || 'Failed to send reset password email');
        toast.error(error.message || 'Failed to send reset password email');
      } else {
        toast.success('Password reset email sent. Please check your inbox.');
        onCancel();
        setResetEmail('');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send reset password email');
      toast.error(error.message || 'Failed to send reset password email');
    } finally {
      setResetInProgress(false);
    }
  };

  return (
    <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
      {errorMessage && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-center text-red-700 font-medium">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input 
          id="reset-email" 
          type="email" 
          placeholder="name@example.com" 
          required 
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={resetInProgress}
        >
          {resetInProgress ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Send Reset Link
        </Button>
      </div>
    </form>
  );
};
