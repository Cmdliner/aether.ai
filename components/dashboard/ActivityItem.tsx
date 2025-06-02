import { ReactNode } from "react";

interface ActivityItemProps {
  icon: ReactNode;
  color: string;
  title: string;
  time: string;
}

export function ActivityItem({ icon, color, title, time }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4 pb-5">
      <div className={`mt-0.5 h-2 w-2 rounded-full ${color}`}></div>
      <div className="flex-1">
        <div className="flex items-center">
          <span className="mr-2">{icon}</span>
          <span className="font-medium">{title}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">{time}</div>
      </div>
    </div>
  );
}
