import { ReactNode } from 'react';

interface ActivityItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  time: string;
}

export function ActivityItem({ icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="p-2 bg-accent/10 rounded-lg text-accent flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  );
}
