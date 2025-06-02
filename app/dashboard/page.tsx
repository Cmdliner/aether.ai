"use client";

import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { TestResultsPending } from "@/components/dashboard/TestResultsPending";
import { RecentHistory } from "@/components/dashboard/RecentHistory";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { validateSession } from "@/lib/session";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername]  = useState<string>("User");

  useEffect(() => {

    (async function () {
      // Check if user is authenticated on client side too
      const res = await fetch("/api/auth/validate-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const { session, user }: { session: any, user: IUser} = await res.json();
      if (!session) {
        redirect("/login");
      }
      console.log({session, user})
      setUsername(user.full_name.split(" ")[0]);
      setIsLoading(false);
    })();

  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  } 
  return (
    <main className="container mx-auto py-6 px-4">
      <WelcomeSection userName={username} />

      <QuickActions />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="h-full">
          <UpcomingAppointments />
        </div>
        <div className="h-full">
          <TestResultsPending />
        </div>
        <div className="h-full sm:col-span-2 md:col-span-1">
          <RecentHistory />
        </div>
      </div>

      <div className="mt-6">
        <RecentActivity />
      </div>
    </main>
  );
}
