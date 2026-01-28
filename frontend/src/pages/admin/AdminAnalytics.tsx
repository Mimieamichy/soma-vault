import { Button } from '@/components/ui/button';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const metrics = [
  { title: 'Monthly Revenue', value: '₦428,150', change: '+18.4%' },
  { title: 'Platform Growth', value: '32.8%', change: '+4.2%' },
  { title: 'Avg. Yield', value: '6.12%', change: 'APY Avg' },
  { title: 'Protocol Fees', value: '₦82.9k', change: '+2.1%' },
];

const distribution = [
  { label: 'Engineering', value: '40.2%' },
  { label: 'Sciences', value: '24.4%' },
  { label: 'Arts', value: '18.3%' },
  { label: 'Others', value: '17.1%' },
];

const volumeData = [
  { month: 'Jan', volume: 210 },
  { month: 'Feb', volume: 280 },
  { month: 'Mar', volume: 260 },
  { month: 'Apr', volume: 320 },
  { month: 'May', volume: 410 },
  { month: 'Jun', volume: 460 },
  { month: 'Jul', volume: 430 },
  { month: 'Aug', volume: 520 },
  { month: 'Sep', volume: 610 },
  { month: 'Oct', volume: 640 },
  { month: 'Nov', volume: 700 },
  { month: 'Dec', volume: 760 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline">Real-time</Button>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Export PDF</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((item) => (
          <div key={item.title} className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-muted-foreground">{item.title}</div>
            <div className="text-2xl font-semibold mt-2">{item.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Monthly Transaction Volume</h2>
              <p className="text-xs text-muted-foreground">Overall platform activity</p>
            </div>
            <Button variant="outline" size="sm">Year 2026</Button>
          </div>
          <ChartContainer
            className="h-56 w-full"
            config={{
              volume: {
                label: 'Volume',
                color: 'hsl(var(--accent))',
              },
            }}
          >
            <AreaChart data={volumeData} margin={{ left: 0, right: 12, top: 12 }}>
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
                dataKey="volume"
                stroke="var(--color-volume)"
                fill="var(--color-volume)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Asset Distribution</h2>
            <div className="text-xs text-muted-foreground">By department</div>
          </div>
          <div className="h-40 rounded-full border border-border flex items-center justify-center text-xl font-semibold">
            100%
          </div>
          <div className="mt-6 space-y-2 text-sm">
            {distribution.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
