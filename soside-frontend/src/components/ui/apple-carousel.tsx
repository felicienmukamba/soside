import React from "react";
import { cn } from "@/lib/utils";

interface AppleCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AppleCarousel({ children, className, ...props }: AppleCarouselProps) {
  return (
    <div 
      className={cn(
        "flex w-full overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 px-4 sm:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AppleCarouselItem({ children, className, ...props }: AppleCarouselProps) {
  return (
    <div 
      className={cn("min-w-[85vw] sm:min-w-[60vw] md:min-w-[40vw] snap-center shrink-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}
