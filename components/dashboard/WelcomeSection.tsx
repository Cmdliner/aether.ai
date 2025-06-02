"use client";

import { useEffect, useState } from "react";

interface WelcomeSectionProps {
  userName?: string;
}

export function WelcomeSection({ userName = "User" }: WelcomeSectionProps) {
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{greeting}, {userName}</h1>
      <p className="text-muted-foreground">Here's a summary of your health activities.</p>
    </div>
  );
}
