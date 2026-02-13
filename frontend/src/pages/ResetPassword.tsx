import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import logo from '@/assets/logo.png';
import logoDark from '@/assets/logo-darkmode.png';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid or missing reset token. Please request a new link.');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      
      setIsSuccess(true);
      toast.success('Password reset successfully');
    } catch (error: any) {
      console.error('Reset password failed', error);
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            <CardTitle className="text-2xl font-bold">Password reset complete</CardTitle>
            <CardDescription>
              Your password has been successfully reset. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" variant="accent" onClick={() => navigate('/login')}>
              Sign in to Soma Vault
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Link to="/">
              <span className="inline-block h-12">
                <img src={logo} alt="Soma Vault" className="h-12 w-auto dark:hidden" />
                <img src={logoDark} alt="Soma Vault" className="h-12 w-auto hidden dark:inline" />
              </span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <CardDescription>
            Enter your new password below to reset your account credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" variant="accent" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting password...' : 'Reset password'}
            </Button>
            
            {!token && (
              <p className="text-xs text-red-500 text-center mt-2">
                Invalid or missing reset token. Please request a new link.
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Return to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
