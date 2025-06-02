import { DashboardCard } from "./DashboardCard";

export function RecentHistory() {
  return (
    <DashboardCard 
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      } 
      title="Recent History"
    >
      <div>
        <div className="text-4xl font-bold">8</div>
        <div className="text-sm text-muted-foreground mt-1">Appointments this month</div>
      </div>
    </DashboardCard>
  );
}
