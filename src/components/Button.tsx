import { cn } from "@/functions/cn";
import Link from "next/link";
import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "dark" | "light";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "dark",
  className,
  onClick,
  disabled = false,
  type = "button",
  href,
  target,
}) => {
  const baseClasses =
    "text-base md:text-xl w-full border border-neutral-900 p-6 font-medium transition-all duration-300 ease-in-out flex items-center justify-center relative group disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    dark: "bg-neutral-900 text-white hover:bg-neutral-800",
    light: "bg-transparent text-neutral-900 hover:bg-neutral-100",
  };

  const mergedClasses = cn(
    baseClasses,
    variantClasses[variant],
    disabled && "pointer-events-none",
    className
  );

  const content = (
    <>
      <span className="text-center">{children}</span>
      <svg
        className="w-5 h-5 ml-3 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </>
  );

  // If href is provided, render as Link
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        onClick={onClick}
        className={mergedClasses}
      >
        {content}
      </Link>
    );
  }

  // Otherwise, render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={mergedClasses}
    >
      {content}
    </button>
  );
};

export default Button;
