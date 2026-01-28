import { useMemo, useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

const roles = [
  { role: 'Super Admin', members: 2, status: 'Full Access' },
  { role: 'Compliance Officer', members: 4, status: 'Read + Approve' },
  { role: 'Audit Only', members: 12, status: 'Read Only' },
];

const SIDEBAR_ITEMS = ['General', 'Security', 'Notifications', 'Roles & Permissions'];

export default function AdminSettings() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('General');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia('(min-width: 1280px)').matches);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const isDark = useMemo(() => {
    if (theme === 'system') {
      if (typeof window === 'undefined') {
        return false;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }, [theme]);

  const renderContent = () => {
    const content = {
      'General': (
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold">General Configuration</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Maintenance Mode</div>
              <div className="text-xs text-muted-foreground">Disable user access during updates</div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Institutional Branding</div>
              <div className="text-xs text-muted-foreground">Allow custom themes for partners</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Dark Mode</div>
              <div className="text-xs text-muted-foreground">Use the dark theme in admin</div>
            </div>
            <Switch checked={isDark} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
          </div>
        </div>
      ),
      'Security': (
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Security Protocols</h2>
            <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Two-Factor Authentication</div>
              <div className="text-xs text-muted-foreground">Require 2FA for administrators</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">IP Allowlist</div>
              <div className="text-xs text-muted-foreground">Restrict access to approved IPs</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm"
              placeholder="Add IP address"
            />
            <Button variant="outline" size="sm">Add</Button>
          </div>
        </div>
      ),
      'Notifications': (
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">Notification settings configuration goes here.</p>
        </div>
      ),
      'Roles & Permissions': (
        <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold truncate">Admin Roles & Permissions</h2>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0" size="sm">Create Role</Button>
          </div>
          <div className="grid grid-cols-3 text-xs text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
            <div>Role</div>
            <div>Members</div>
            <div>Status</div>
          </div>
          {roles.map((item) => (
            <div key={item.role} className="grid grid-cols-3 text-sm py-2 border-b border-border last:border-none">
              <div>{item.role}</div>
              <div>{item.members}</div>
              <div className="text-accent">{item.status}</div>
            </div>
          ))}
        </div>
      )
    };

    if (isDesktop) {
      return content[activeTab as keyof typeof content];
    }

    // On mobile, show all sections
    return (
      <div className="space-y-4">
        {SIDEBAR_ITEMS.map(item => (
          <div key={item}>
            {content[item as keyof typeof content]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr] gap-4">
        <div className="hidden xl:block bg-card border border-border rounded-xl p-4 space-y-2 h-fit">
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                activeTab === item && isDesktop
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
