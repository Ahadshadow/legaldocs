"use client";

import * as React from "react";
import { cn } from "../../lib/utils"; // Utility for conditional classNames, adapt or remove as needed

// Avatar Component
const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

// AvatarImage Component
const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

// AvatarFallback Component
const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-gray-500",
      className
    )}
    {...props}
  >
    {children || "?"} {/* Default fallback content */}
  </div>
));
AvatarFallback.displayName = "AvatarFallback";

// Exporting all components
export { Avatar, AvatarImage, AvatarFallback };
