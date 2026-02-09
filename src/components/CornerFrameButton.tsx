"use client";

import { cn } from "@/functions/cn";
import Link from "next/link";
import React, { ReactNode } from "react";

interface CornerFrameButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  frameColor?: string;
  frameSize?: "sm" | "md" | "lg";
  target?: "_blank" | "_self" | "_parent" | "_top";
}

// Reusable corner frame elements
const CornerFrames: React.FC<{ frameColor: string; frameSize: string }> = ({
  frameColor,
  frameSize,
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const size = sizeClasses[frameSize as keyof typeof sizeClasses] || sizeClasses.md;

  return (
    <>
      <div
        className={cn(
          "absolute top-0 left-0 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity",
          size,
          frameColor
        )}
      />
     
  
      <div
        className={cn(
          "absolute bottom-0 right-0 border-r-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity",
          size,
          frameColor
        )}
      />
    </>
  );
};

const CornerFrameButton: React.FC<CornerFrameButtonProps> = ({
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  className,
  frameColor = "border-primary-600",
  frameSize = "md",
  target,
}) => {
  const baseClasses = cn(
    "group relative px-8 py-3 text-sm tracking-[0.2em] uppercase",
    "text-text-primary hover:text-primary-600 transition-colors font-medium",
    "border border-border-default border-primary-600",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  const content = (
    <>
      <CornerFrames frameColor={frameColor} frameSize={frameSize} />
      {children}
    </>
  );

  // Render as Link if href is provided
  if (href) {
    return (
      <Link href={href} target={target} className={baseClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {content}
    </button>
  );
};

// Export CornerFrames separately for use in other components
export { CornerFrames };
export default CornerFrameButton;
