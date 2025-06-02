import { DashboardCard } from "./DashboardCard";

export function TestResultsPending() {
  return (
    <DashboardCard 
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      } 
      title="Test Results Pending"
    >
      <div>
        <div className="text-4xl font-bold">2</div>
        <div className="text-sm text-muted-foreground mt-1">Expected within 48 hours</div>
      </div>
    </DashboardCard>
  );
}
