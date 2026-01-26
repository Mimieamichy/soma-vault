import { TrendingUp, Users, ShieldCheck, Clock } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const metrics = [
  { title: 'Active Users', value: '12,540', change: '+5.2%', icon: Users },
  { title: 'New Uploads', value: '2,184', change: '+3.1%', icon: TrendingUp },
  { title: 'System Health', value: '99.9%', change: 'Stable', icon: ShieldCheck },
  { title: 'Avg. Response', value: '1.2s', change: '-0.2s', icon: Clock },
];

const activity = [
  { title: 'New user onboarded', detail: 'Sarah Richards • Computer Science', time: '2 mins ago' },
  { title: 'Upload approved', detail: 'PHY 402 Past Questions', time: '18 mins ago' },
  { title: 'Department update', detail: 'Faculty of Engineering', time: '42 mins ago' },
  { title: 'Access granted', detail: 'Admin role assigned', time: '1 hr ago' },
];

const growthData = [
  { month: 'Jan', uploads: 320 },
  { month: 'Feb', uploads: 410 },
  { month: 'Mar', uploads: 380 },
  { month: 'Apr', uploads: 520 },
  { month: 'May', uploads: 610 },
  { month: 'Jun', uploads: 740 },
  { month: 'Jul', uploads: 690 },
  { month: 'Aug', uploads: 810 },
  { month: 'Sep', uploads: 760 },
  { month: 'Oct', uploads: 880 },
  { month: 'Nov', uploads: 920 },
  { month: 'Dec', uploads: 1040 },
];

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{item.title}</div>
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
              </div>
              <div className="mt-4 text-2xl font-semibold">{item.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Monthly Growth</h2>
              <p className="text-xs text-muted-foreground">Uploads and study activity</p>
            </div>
            <div className="text-xs text-muted-foreground">Last 30 days</div>
          </div>
          <ChartContainer
            className="h-56 w-full"
            config={{
              uploads: {
                label: 'Uploads',
                color: 'hsl(var(--accent))',
              },
            }}
          >
            <AreaChart data={growthData} margin={{ left: 0, right: 12, top: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={32}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="uploads"
                stroke="var(--color-uploads)"
                fill="var(--color-uploads)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button variant="ghost" className="text-xs">View all</Button>
          </div>
          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item.title} className="border border-border rounded-lg p-3">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.detail}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
