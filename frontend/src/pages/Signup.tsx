import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import logo from '@/assets/logo.png';
import logoDark from '@/assets/logo-darkmode.png';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';





export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get('/schools/');
        // Assume response.data.data is the array of schools, or response.data if it's direct
        let schoolsData: any[] = [];
        if (response.data.success && Array.isArray(response.data.data)) {
          schoolsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          schoolsData = response.data;
        }
        
        // Deduplicate schools based on name (or the string value itself)
        const uniqueSchools = Array.from(new Set(schoolsData.map(s => typeof s === 'string' ? s : s.name)))
          .map(name => {
            return schoolsData.find(s => (typeof s === 'string' ? s : s.name) === name);
          });
          
        setSchools(uniqueSchools);
      } catch (error) {
        console.error('Failed to fetch schools', error);
      }
    };
    fetchSchools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error('You must agree to the Terms and Conditions to continue');
      return;
    }
    if (email && password && name && school) {
      setIsSubmitting(true);
      try {
        await signup(email.trim(), name.trim(), school.trim(), password);
        toast.success('Account created successfully!');
        navigate('/study-planner');
      } catch (error: any) {
        console.error('Signup failed', error);
        toast.error(error.response?.data?.error || 'Failed to create account');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

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
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <Select value={school} onValueChange={setSchool}>
                <SelectTrigger id="school">
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
                <SelectContent side="bottom" avoidCollisions={false}>
                  {schools.length > 0 ? (
                    schools.map((s, index) => (
                      <SelectItem key={`${s.id || s.name || s}-${index}`} value={s.name || s}>
                        {s.name || s}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>Loading schools...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
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
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2 py-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms} 
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1"
              />
              <Label 
                htmlFor="terms" 
                className="text-sm leading-relaxed text-muted-foreground cursor-pointer select-none"
              >
                I agree to the <span className="text-primary font-medium">Terms and Conditions</span>. I understand that any material I upload will be available for other users to download and use.
              </Label>
            </div>

            <Button type="submit" className="w-full" variant="accent" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
