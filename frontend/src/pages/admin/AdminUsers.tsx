import { Button } from '@/components/ui/button';

const users = [
  { name: 'Sarah Richardson', email: 'sarah@soma.edu', status: 'Active', role: 'Student', assets: '₦1,245,600' },
  { name: 'Marcus Chen', email: 'm.chen@soma.edu', status: 'Flagged', role: 'Moderator', assets: '₦890,200' },
  { name: 'Elena Lombardi', email: 'elena@soma.edu', status: 'Suspended', role: 'Student', assets: '₦12,400' },
  { name: 'John Doe', email: 'john.doe@soma.edu', status: 'Active', role: 'Administrator', assets: '₦2,842,000' },
];

const statusStyle: Record<string, string> = {
  Active: 'bg-emerald-500/10 text-emerald-500',
  Flagged: 'bg-amber-500/10 text-amber-500',
  Suspended: 'bg-rose-500/10 text-rose-500',
};

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline">Filter</Button>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Export CSV</Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-5 text-xs text-muted-foreground uppercase tracking-wider pb-3 border-b border-border">
              <div>User</div>
              <div>Status</div>
              <div>Role</div>
              <div>Total Assets</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-border">
              {users.map((user) => (
                <div key={user.email} className="grid grid-cols-5 items-center py-4 text-sm">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusStyle[user.status]}`}>
                      {user.status}
                    </span>
                  </div>
                  <div>{user.role}</div>
                  <div>{user.assets}</div>
                  <div className="text-right text-muted-foreground">•••</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground uppercase">Verified Today</div>
          <div className="text-2xl font-semibold mt-2">124 Users</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground uppercase">Pending Review</div>
          <div className="text-2xl font-semibold mt-2">18 Cases</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground uppercase">Password Resets</div>
          <div className="text-2xl font-semibold mt-2">42 Requests</div>
        </div>
      </div>
    </div>
  );
}
