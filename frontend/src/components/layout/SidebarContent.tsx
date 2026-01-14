import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Archive, 
  Library,
  CalendarDays, 
  User, 
} from 'lucide-react';
import logo from '@/assets/logo.png';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Archive', path: '/archive', icon: Archive },
  { name: 'My Library', path: '/library', icon: Library },
  { name: 'Study Planner', path: '/study-planner', icon: CalendarDays },
  { name: 'Profile', path: '/profile', icon: User },
];

interface SidebarContentProps {
  collapsed?: boolean;
  onLinkClick?: () => void;
}

export function SidebarContent({ collapsed = false, onLinkClick }: SidebarContentProps) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border shrink-0">
        <img 
          src={logo} 
          alt="Study Vault" 
          className={`h-8 w-auto transition-all duration-300 ${collapsed ? 'mx-auto' : ''}`}
        />
        {!collapsed && (
          <span className="ml-2 font-semibold text-lg animate-fade-in">Study Vault</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-sidebar-foreground/80'
              }`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
              {!collapsed && (
                <span className="font-medium animate-fade-in">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
