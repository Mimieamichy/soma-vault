import { Button } from '@/components/ui/button';

const transactions = [
  { id: 'TX-8721', type: 'Deposit', amount: '₦450,500', user: 'John Doe', status: 'Confirmed', time: '2 mins ago' },
  { id: 'TX-2194', type: 'Withdrawal', amount: '₦120,000', user: 'Sarah Crypto', status: 'Pending', time: '14 mins ago' },
  { id: 'TX-9901', type: 'Transfer', amount: '₦1,200,000', user: 'Alex Rivera', status: 'Confirmed', time: '45 mins ago' },
  { id: 'TX-1142', type: 'Withdrawal', amount: '₦5,000,000', user: 'Unknown User', status: 'Failed', time: '1 hr ago' },
];

const statusStyle: Record<string, string> = {
  Confirmed: 'bg-emerald-500/10 text-emerald-500',
  Pending: 'bg-amber-500/10 text-amber-500',
  Failed: 'bg-rose-500/10 text-rose-500',
};

export default function AdminTransactions() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Export Ledger</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: '24h Volume', value: '₦4.82M' },
          { title: 'Total Pending', value: '142' },
          { title: 'Failed (24h)', value: '3' },
          { title: 'Gas Efficiency', value: '94.2%' },
        ].map((item) => (
          <div key={item.title} className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase">{item.title}</div>
            <div className="text-xl font-semibold mt-2">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-6 text-xs text-muted-foreground uppercase tracking-wider pb-3 border-b border-border">
              <div>Tx ID</div>
              <div>Type</div>
              <div>Amount</div>
              <div>User</div>
              <div>Status</div>
              <div className="text-right">Time</div>
            </div>
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="grid grid-cols-6 items-center py-4 text-sm">
                  <div className="text-accent">{tx.id}</div>
                  <div>{tx.type}</div>
                  <div>{tx.amount}</div>
                  <div>{tx.user}</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusStyle[tx.status]}`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-right text-muted-foreground">{tx.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
