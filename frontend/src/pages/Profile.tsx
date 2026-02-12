import { useState, useEffect } from 'react';
import { Mail, Moon, CreditCard, Check, User, Pencil, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from '@/components/theme-provider';
import { SubscriptionModal } from '@/components/profile/SubscriptionModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';


const subscriptionPlans = [
  {
    name: 'Free',
    price: '₦0',
    features: ['5 Study Plans', '1GB Storage', 'Basic PQ Hub'],
    current: true,
  },
  {
    name: 'PRO',
    price: '₦1,800/quarter',
    features: ['Unlimited Plans', '50GB Storage', 'Advanced AI Features', 'Priority Support'],
    current: false,
  },
  {
    name: 'PREMIUM',
    price: '₦7,000/year',
    features: ['Everything in Pro', 'Offline Access', 'Priority Support', 'API Access'],
    current: false,
  },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Update name if changed
      if (name !== user?.name) {
        await updateProfile({ name });
      }

      // Update password if provided
      if (password) {
        await api.post('/auth/reset-password', { password });
      }


      

      if (name === user?.name && !password) {
        setIsEditing(false);
        return;
      }
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setPassword('');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Account Details Card */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
        {!isEditing ? (
          // View Mode (Matches Screenshot)
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-[#B91C1C] text-white text-3xl font-medium">
                {user?.name ? getInitials(user.name) : 'SV'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <h3 className="text-2xl font-bold text-foreground">{user?.name || 'Guest User'}</h3>
              <p className="text-muted-foreground">{user?.email || 'No email'}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{user?.school || 'No School'}</span>
                <span>•</span>
               
              </div>
            </div>
            
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        ) : (
          // Edit Mode
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Edit Profile</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
            
            <div className="flex flex-col items-center mb-8">
              <Avatar className="h-24 w-24 border-2 border-border transition-colors">
                <AvatarFallback className="bg-[#B91C1C] text-white text-3xl font-medium">
                  {user?.name ? getInitials(user.name) : 'SV'}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} disabled className="bg-muted/50 cursor-not-allowed" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="school">School</Label>
                <Input id="school" defaultValue={user?.school || ''} disabled className="bg-muted/50 cursor-not-allowed" />
                <p className="text-[10px] text-muted-foreground italic">School information is managed by administration</p>
              </div>

              <Separator className="my-2" />
              
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isSaving ? <LoadingSpinner size={16} className="mr-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>



      {/* Settings */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-6">Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Weekly progress reports</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
            </div>
            <Switch 
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Subscription</h3>
            <p className="text-sm text-muted-foreground">Manage your academic plan and billing</p>
          </div>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>
        <Button 
          className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => setIsSubscriptionModalOpen(true)}
        >
          View Subscription Plans
        </Button>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        open={isSubscriptionModalOpen}
        onOpenChange={setIsSubscriptionModalOpen}
        plans={subscriptionPlans}
      />

    </div>
  );
}
