
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoaderCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

const Auth: React.FC = () => {
  const { user, loading, isPasswordRecovery } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // If user is already logged in and not in password recovery mode, redirect to home
  if (user && !loading && !isPasswordRecovery) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 text-invoice-blue" />
      </div>
    );
  }

  // For password recovery flow
  if (isPasswordRecovery) {
    return (
      <AuthLayout 
        title="Reset Your Password"
        description="Please enter a new password for your account"
      >
        <ResetPasswordForm />
      </AuthLayout>
    );
  }

  // For normal authentication flow
  return (
    <AuthLayout 
      title="Welcome to InvoiceArtisan"
      description="Sign in to manage your company templates and invoices"
      footer={
        <div className="text-sm text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      }
    >
      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-center text-green-700 font-medium">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
        </TabsContent>

        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>

      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <ForgotPasswordForm onCancel={() => setShowForgotPassword(false)} />
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
};

export default Auth;
