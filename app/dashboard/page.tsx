"use client";

import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { TestResultsPending } from "@/components/dashboard/TestResultsPending";
import { RecentHistory } from "@/components/dashboard/RecentHistory";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { useAuth } from "@/lib/client-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const { isLoading, isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect if not authenticated (handled by useEffect)
    if (!isAuthenticated) {
        return null;
    } return (
        <main className="container mx-auto py-6 px-4">
            <WelcomeSection userName={user?.full_name?.split(" ")?.[0] ?? "User"} />

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
