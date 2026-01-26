import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Settings,
  Users,
  LayoutDashboard,
  ArrowLeftRight,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Transactions', path: '/admin/transactions', icon: ArrowLeftRight },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminBottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 border-t border-border bg-card z-40">
      <div className="flex items-center justify-between px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md text-xs ${
                isActive ? 'text-accent' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
