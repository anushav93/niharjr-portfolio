import { cn } from "@/functions/cn";
import React, { ReactNode } from "react";

interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small" | "span";
  className?: string;
  children: ReactNode;
  fontWeight?:
    | "extralight"
    | "light"
    | "normal"
    | "bold"
    | "semibold"
    | "extrabold";
  wrapper?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small" | "span";
  color?: "dark" | "light" | "red";
  offDarkMode?: boolean;
}

const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className,
  fontWeight,
  wrapper,
  color,
  offDarkMode,
}) => {
  const Tag = wrapper || variant;

  let defaultClasses = offDarkMode
    ? ""
    : "text-blue-600  transition-all duration-300 ease-in-out ";
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
    case "span":
      defaultClasses += "text-base";
      break;
    case "small":
      defaultClasses += "text-xs";
      break;
    default:
      break;
  }

  switch (fontWeight) {
    case "extralight":
      defaultClasses += " font-light";
      break;
    case "light":
      defaultClasses += " font-extralight";
      break;
    case "normal":
      defaultClasses += " font-normal";
      break;
    case "bold":
      defaultClasses += " font-bold";
      break;
    case "semibold":
      defaultClasses += " font-semibold";
      break;
    case "extrabold":
      defaultClasses += " font-extrabold";
      break;
    default:
      break;
  }

  switch (color) {
    case "dark":
      defaultClasses += "";
      break;
    case "light":
      defaultClasses += "";
      break;
    case "red":
      defaultClasses += " !text-customRed-500 dark:!text-customRed-500 ";
      break;
    default:
      break;
  }

  const mergedClasses = cn(defaultClasses, className);
  return <Tag className={mergedClasses}>{children}</Tag>;
};

export default Typography;
