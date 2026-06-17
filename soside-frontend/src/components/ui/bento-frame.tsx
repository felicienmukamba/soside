import React from "react";
import { cn } from "@/lib/utils";

interface BentoFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function BentoFrame({ children, className, ...props }: BentoFrameProps) {
  return (
    <div 
      className={cn(
        "bg-card text-card-foreground rounded-3xl p-8 border border-border shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
