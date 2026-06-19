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
  variant?: "primary" | "secondary";
  frameColor?: string;
  frameSize?: "sm" | "md" | "lg";
  target?: "_blank" | "_self" | "_parent" | "_top";
}

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

const variantStyles = {
  primary: {
    button:
      "inline-flex items-center justify-center bg-[#2a231f] text-[#faf8f5] border-[#2a231f] hover:bg-[#3d322a] hover:text-[#faf8f5]",
    frame: "border-[#bfa078]",
  },
  secondary: {
    button:
      "inline-flex items-center justify-center bg-transparent text-[#2a231f] border-[#2a231f] hover:bg-[#2a231f]/5 hover:text-[#544536]",
    frame: "border-[#6e5c44]",
  },
};

const CornerFrameButton: React.FC<CornerFrameButtonProps> = ({
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  className,
  variant = "secondary",
  frameColor,
  frameSize = "md",
  target,
}) => {
  const styles = variantStyles[variant];
  const resolvedFrameColor = frameColor ?? styles.frame;

  const baseClasses = cn(
    "group relative px-8 py-3 text-sm tracking-[0.2em] uppercase",
    "border transition-colors font-medium",
    styles.button,
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  const content = (
    <>
      <CornerFrames frameColor={resolvedFrameColor} frameSize={frameSize} />
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} target={target} className={baseClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

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

export { CornerFrames };
export default CornerFrameButton;
