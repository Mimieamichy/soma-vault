import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Settings,
  Users,
  LayoutDashboard,
  ArrowLeftRight,
} from 'lucide-react';
import logo from '@/assets/logo.png';
import logoDark from '@/assets/logo-darkmode.png';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Transactions', path: '/admin/transactions', icon: ArrowLeftRight },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn("w-64 flex-col border-r border-border bg-card", className)}>
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <span className="inline-block h-8">
          <img src={logo} alt="Soma Vault" className="h-8 w-auto dark:hidden" />
          <img src={logoDark} alt="Soma Vault" className="h-8 w-auto hidden dark:inline" />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-foreground">Soma Vault</div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest">Admin Console</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
