"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { useState } from "react";

export default function TestToast() {
  const [currentToastId, setCurrentToastId] = useState<string | null>(null);
  
  const showSuccessToast = () => {
    const toastResult = toast({
      title: "Success!",
      description: "This is a success toast notification. Try clicking the X or the dismiss button.",
      variant: "default",
    });
    
    if (toastResult) {
      setCurrentToastId(toastResult.id);
    }
  };
  
  const showErrorToast = () => {
    const toastResult = toast({
      title: "Error!",
      description: "This is an error toast notification. Try clicking the X or the dismiss button.",
      variant: "destructive",
    });
    
    if (toastResult) {
      setCurrentToastId(toastResult.id);
    }
  };
  
  const dismissToast = () => {
    if (currentToastId) {
      toast.dismiss(currentToastId);
      setCurrentToastId(null);
    } else {
      // If no specific toast ID, dismiss all toasts
      toast.dismiss();
    }
  };
  
  const showAutoCloseToast = () => {
    const toastResult = toast({
      title: "Auto-close Toast",
      description: "This toast will automatically close after 3 seconds",
      variant: "default",
    });
    
    if (toastResult) {
      setTimeout(() => {
        toast.dismiss(toastResult.id);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold mb-4">Toast Tester</h1>
      <div className="flex flex-col gap-4 w-64">
        <Button onClick={showSuccessToast} className="w-full">Show Success Toast</Button>
        <Button onClick={showErrorToast} variant="destructive" className="w-full">Show Error Toast</Button>
        <Button onClick={showAutoCloseToast} variant="outline" className="w-full">Show Auto-close Toast (3s)</Button>
        <Button 
          onClick={dismissToast} 
          variant="secondary" 
          className="w-full"
          disabled={!currentToastId}
        >
          Dismiss Current Toast
        </Button>
      </div>
    </div>
  );
}
