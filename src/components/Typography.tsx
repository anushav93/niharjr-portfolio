import { cn } from "@/functions/cn";
import React, { ReactNode } from "react";

interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small";
  className?: string;
  children: ReactNode;
  fontWeight?:
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold";
  wrapper?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small";
  color?: "dark" | "medium" | "light";
}

const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className,
  fontWeight,
  wrapper,
  color = "dark",
}) => {
  const Tag = wrapper || variant;

  let defaultClasses = "";

  // Base typography styles for each variant
  switch (variant) {
    case "h1":
      defaultClasses += "text-5xl md:text-6xl lg:text-7xl font-bold";
      break;
    case "h2":
      defaultClasses += "text-4xl md:text-5xl lg:text-6xl font-semibold";
      break;
    case "h3":
      defaultClasses += "text-3xl md:text-4xl lg:text-5xl font-semibold";
      break;
    case "h4":
      defaultClasses += "text-2xl font-semibold";
      break;
    case "h5":
      defaultClasses += "text-xl font-semibold";
      break;
    case "h6":
      defaultClasses += "text-lg font-semibold";
      break;
    case "p":
      defaultClasses += "text-base";
      break;
    case "small":
      defaultClasses += "text-xs tracking-[0.15em] ";
      break;
    default:
      break;
  }

  // Apply font weight if specified (overrides variant default)
  if (fontWeight) {
    switch (fontWeight) {
      case "extralight":
        defaultClasses += " font-extralight";
        break;
      case "light":
        defaultClasses += " font-light";
        break;
      case "normal":
        defaultClasses += " font-normal";
        break;
      case "medium":
        defaultClasses += " font-medium";
        break;
      case "semibold":
        defaultClasses += " font-semibold";
        break;
      case "bold":
        defaultClasses += " font-bold";
        break;
      case "extrabold":
        defaultClasses += " font-extrabold";
        break;
      default:
        break;
    }
  }

  // Apply color
  switch (color) {
    case "dark":
      defaultClasses += " text-neutral-900";
      break;
    case "medium":
      defaultClasses += " text-neutral-600";
      break;
    case "light":
      defaultClasses += " text-neutral-50";
      break;
    default:
      break;
  }

  const mergedClasses = cn(defaultClasses, className);
  return <Tag className={mergedClasses}>{children}</Tag>;
};

export default Typography;
