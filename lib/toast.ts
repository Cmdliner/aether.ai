"use client"

// This file provides a way to display toast notifications outside of React components
// by accessing the internal toast dispatch mechanism

import { type ToastType } from "@/hooks/use-toast";

// Access the dispatch function from the memory state managed in use-toast.tsx
const TOAST_DISPATCH_KEY = "__TOAST_DISPATCH_FN__";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Create a toast function that works without hooks
export const toast = (props: ToastProps) => {
  // Get the dispatch function from the global object
  const dispatchFn = (window as any)[TOAST_DISPATCH_KEY];
  
  if (!dispatchFn) {
    console.warn("Toast dispatcher not found. Make sure your app has loaded the Toaster component.");
    return;
  }
  
  const id = String(Date.now());
  
  // Use the dispatch function to show a toast
  dispatchFn({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
    },
  });
  
  return {
    id,
    dismiss: () => toast.dismiss(id),
  };
};

// Add a dismiss method to the toast function
toast.dismiss = (toastId?: string) => {
  const dispatchFn = (window as any)[TOAST_DISPATCH_KEY];
  
  if (!dispatchFn) {
    console.warn("Toast dispatcher not found. Make sure your app has loaded the Toaster component.");
    return;
  }
  
  dispatchFn({
    type: "DISMISS_TOAST",
    toastId: toastId,
  });
};

// For internal use by the Toaster component
export const setToastDispatch = (dispatch: (action: any) => void) => {
  if (typeof window !== "undefined") {
    (window as any)[TOAST_DISPATCH_KEY] = dispatch;
  }
};
