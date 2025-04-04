
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(error.message || 'Failed to sign in');
        toast.error(error.message || 'Failed to sign in');
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to sign in');
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {errorMessage && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-center text-red-700 font-medium">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="name@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-invoice-blue hover:bg-invoice-darkBlue"
        disabled={isLoading}
      >
        {isLoading ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Sign In
      </Button>
      <div className="text-center">
        <button 
          type="button" 
          className="text-sm text-blue-600 hover:underline"
          onClick={onForgotPassword}
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
};
