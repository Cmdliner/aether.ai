"use client"

import { useState } from "react"
import { Check, ChevronRight, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StepProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  isActive?: boolean
  isComplete?: boolean
  isLoading?: boolean
  isLastStep?: boolean
  index?: number
}

export function Step({
  title,
  description,
  isActive = false,
  isComplete = false,
  isLoading = false,
  isLastStep = false,
  index,
  className,
  ...props
}: StepProps) {
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {isComplete ? (
        <div className="size-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="size-4 text-primary-foreground" />
        </div>
      ) : isLoading ? (
        <div className="size-6 rounded-full border border-input flex items-center justify-center">
          <Loader2 className="size-4 text-muted-foreground animate-spin" />
        </div>
      ) : (
        <div
          className={cn(
            "size-6 rounded-full border flex items-center justify-center",
            isActive 
              ? "border-primary bg-primary text-primary-foreground" 
              : "border-input text-muted-foreground"          )}
        >
          <span className="text-xs">{index}</span>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <h3 className={cn(
          "text-sm font-medium leading-none",
          isActive && "text-foreground"
        )}>
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {!isLastStep && (
        <ChevronRight className="size-4 text-muted-foreground ml-auto self-center" />
      )}
    </div>
  )
}

interface StepperProps extends React.ComponentProps<"div"> {
  steps: {
    title: string
    description?: string
  }[]
  currentStep?: number
  loading?: boolean
}

export function Stepper({
  steps,
  currentStep = 0,
  loading,
  className,
  ...props
}: StepperProps) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >      {steps.map((step, index) => (
        <Step
          key={index}
          index={index + 1}
          title={step.title}
          description={step.description}
          isActive={currentStep === index}
          isComplete={currentStep > index}
          isLoading={loading && currentStep === index}
          isLastStep={index === steps.length - 1}
        />
      ))}
    </div>
  )
}
