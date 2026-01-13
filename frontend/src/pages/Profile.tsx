import { User, Mail, GraduationCap, Bell, Moon, Globe, CreditCard, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

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
    price: '$0',
    features: ['5 Study Plans', '1GB Storage', 'Basic PQ Hub'],
    current: false,
  },
  {
    name: 'Pro',
    price: '$9.99/mo',
    features: ['Unlimited Plans', '50GB Storage', 'Advanced AI Features', 'Priority Support'],
    current: true,
  },
  {
    name: 'Team',
    price: '$19.99/mo',
    features: ['Everything in Pro', 'Team Collaboration', 'Admin Dashboard', 'API Access'],
    current: false,
  },
];

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profile</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* User Info Card */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground">{mockUser.name}</h3>
            <p className="text-muted-foreground">{mockUser.email}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                {mockUser.institution}
              </span>
              <span>•</span>
              <span>{mockUser.major}</span>
            </div>
          </div>
          
          <Button variant="outline">Edit Profile</Button>
        </div>
      </div>

      {/* Theme Preview */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-4">Theme Preview</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Colors extracted from your brand logo
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-16 rounded-lg bg-primary" />
            <p className="text-xs text-center text-muted-foreground">Primary (Navy)</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg bg-accent" />
            <p className="text-xs text-center text-muted-foreground">Accent (Crimson)</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg bg-secondary" />
            <p className="text-xs text-center text-muted-foreground">Secondary (Beige)</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg bg-muted" />
            <p className="text-xs text-center text-muted-foreground">Muted</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
        <h3 className="text-lg font-semibold text-foreground mb-6">Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive study reminders</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
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
            <Switch />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Language</p>
                <p className="text-sm text-muted-foreground">English (US)</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-card animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Subscription</h3>
            <p className="text-sm text-muted-foreground">Manage your subscription plan</p>
          </div>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-xl p-4 border-2 transition-all ${
                plan.current 
                  ? 'border-accent bg-accent/5' 
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{plan.name}</h4>
                {plan.current && (
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground mb-4">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                >
                  {plan.name === 'Free' ? 'Downgrade' : 'Upgrade'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
