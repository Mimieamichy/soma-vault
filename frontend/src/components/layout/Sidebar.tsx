import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Archive, 
  CalendarDays, 
  User, 
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import logo from '@/assets/logo.png';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Archive', path: '/archive', icon: Archive },
  { name: 'Study Planner', path: '/study-planner', icon: CalendarDays },
  { name: 'Profile', path: '/profile', icon: User },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground sidebar-transition z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center  h-16 px-4 border-b border-sidebar-border">
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
      <nav className="mt-6 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-accent text-accent-foreground' 
                  : 'hover:bg-accent text-sidebar-foreground/80 hover:text-accent-foreground'
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

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 rounded-lg bg-sidebar-accent hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
