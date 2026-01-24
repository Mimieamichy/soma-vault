import { useState, useRef } from 'react';
import { Mail, Moon, CreditCard, Check, Camera, User, Pencil, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/components/theme-provider';
import { SubscriptionModal } from '@/components/profile/SubscriptionModal';

const mockUser = {
  name: 'John Doe',
  email: 'john.doe@university.edu',
  institution: 'State University',
  major: 'Computer Science',
  joinDate: 'January 2024',
};

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
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Account Details Card */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
        {!isEditing ? (
          // View Mode (Matches Screenshot)
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar || ''} />
              <AvatarFallback className="bg-[#B91C1C] text-white text-3xl font-medium">
                JD
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <h3 className="text-2xl font-bold text-foreground">{mockUser.name}</h3>
              <p className="text-muted-foreground">{mockUser.email}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{mockUser.institution}</span>
                <span>•</span>
                <span>{mockUser.major}</span>
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
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="h-24 w-24 border-2 border-border group-hover:border-accent transition-colors">
                  <AvatarImage src={avatar || ''} />
                  <AvatarFallback className="bg-[#B91C1C] text-white text-3xl font-medium">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">Click to upload new picture</p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={mockUser.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={mockUser.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
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
