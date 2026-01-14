import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useIsMobile } from '@/hooks/use-mobile';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/archive': 'Archive',
  '/study-planner': 'Study Planner',
  '/profile': 'Profile',
};

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const pageTitle = pageTitles[location.pathname] || 'Study Vault';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className={`sidebar-transition ${
          isMobile 
            ? 'ml-0' 
            : sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <TopNav title={pageTitle} />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
