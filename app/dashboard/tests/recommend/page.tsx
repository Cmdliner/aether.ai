"use client";

import TestRecommendationForm from "@/components/test-recommendation/TestRecommendationForm";
import { useAuth } from "@/lib/client-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TestRecommendationPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

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

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <TestRecommendationForm />
      </div>
    </div>
  );
}
