"use client"
 
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { setToastDispatch } from "@/lib/toast"
import { useEffect } from "react"
 
export function Toaster() {
  const { toasts, toast, dismiss } = useToast()
  
  // Register the toast dispatch function for use outside of React components
  useEffect(() => {
    const dispatch = (action: any) => {
      if (action.type === "ADD_TOAST") {
        toast({
          title: action.toast.title,
          description: action.toast.description,
          variant: action.toast.variant,
          action: action.toast.action,
        });
      } else if (action.type === "DISMISS_TOAST") {
        dismiss(action.toastId);
      }
    };
    
    setToastDispatch(dispatch);
    
    // Cleanup function
    return () => setToastDispatch(null as any);
  }, [toast, dismiss]);
    return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose onClick={() => dismiss(id)} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
