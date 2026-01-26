import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminBottomNav } from './AdminBottomNav';
import { ModeToggle } from '@/components/mode-toggle';
import { NotificationsModal } from '@/components/layout/NotificationsModal';

export function AdminLayout() {
  const location = useLocation();
  const titles: Record<string, string> = {
    '/admin/overview': 'Dashboard Overview',
    '/admin/users': 'User Management',
    '/admin/transactions': 'Transaction Monitoring',
    '/admin/analytics': 'Advanced Analytics',
    '/admin/settings': 'System Settings',
  };
  const pageTitle = titles[location.pathname] || 'Admin Console';

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar className="hidden lg:flex" />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="text-lg font-semibold">{pageTitle}</div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <NotificationsModal />
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>SV</AvatarFallback>
            </Avatar>
            <div className="hidden xl:block">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-muted-foreground">System Admin</div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
        <AdminBottomNav />
      </div>
    </div>
  );
}
