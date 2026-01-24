import { Link, useLocation } from 'react-router-dom';
import { 
  Archive, 
  Library,
  CalendarDays, 
  User, 
} from 'lucide-react';

const navItems = [
  { name: 'Study', path: '/study-planner', icon: CalendarDays },
  { name: 'Archive', path: '/archive', icon: Archive },
  { name: 'Library', path: '/library', icon: Library },
  { name: 'Profile', path: '/profile', icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 pb-2 pt-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
