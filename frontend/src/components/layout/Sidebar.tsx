import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SidebarContent } from './SidebarContent';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground sidebar-transition z-50 hidden md:block ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <SidebarContent collapsed={collapsed} />

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
