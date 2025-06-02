import { DashboardCard } from "./DashboardCard";

export function UpcomingAppointments() {
  return (
    <DashboardCard 
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      } 
      title="Upcoming Appointments"
    >
      <div>
        <div className="text-4xl font-bold">3</div>
        <div className="text-sm text-muted-foreground mt-1">Next: Today at 2:30 PM</div>
      </div>
    </DashboardCard>
  );
}
