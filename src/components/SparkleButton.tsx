import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/functions/cn";

// Define types for the sparkle properties
interface SparkleProps {
  style: {
    top: string;
    left: string;
    backgroundColor: string;
    width: string;
    height: string;
    endX: number;
    endY: number;
  };
}

// Define types for a single sparkle object
interface SparkleObject {
  id: string;
  color: string;
  size: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// Define props for the SparkleButton component
interface SparkleButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "sideBySide" | "outline";
  position?: "left" | "right" | "standalone";
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Define a sparkle component
const Sparkle: React.FC<SparkleProps> = ({ style }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-white"
      style={style}
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [1, 1, 0],
        x: [0, style.endX || 0],
        y: [0, style.endY || 0],
      }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
    />
  );
};

const SparkleButton: React.FC<SparkleButtonProps> = ({ 
  href, 
  children, 
  className = "",
  variant = "default",
  position = "standalone",
  onClick
}) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [sparkles, setSparkles] = useState<SparkleObject[]>([]);

  const addSparkles = () => {
    // Create 6-10 random sparkles
    const count = Math.floor(Math.random() * 5) + 6;
    const newSparkles = Array.from({ length: count }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      color: `hsl(${Math.random() * 60 + 220}, 100%, 70%)`,
      size: Math.random() * 3 + 1,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      endX: (Math.random() - 0.5) * 60,
      endY: (Math.random() - 0.5) * 60,
    }));
    
    setSparkles(newSparkles);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isHovering) {
      // Initial sparkles
      addSparkles();
      // Then add more every 300ms
      interval = setInterval(() => {
        addSparkles();
      }, 300);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovering]);

  // Base styles that apply to all variants
  const baseStyles = "relative inline-flex items-center justify-center overflow-visible h-12 px-6";
  
  // Variant specific styles
  const variantStyles = {
    default: "bg-black text-white",
    sideBySide: cn(
      "bg-black text-white",
      position === "left" && "rounded-r-none border-r-0 mr-0",
      position === "right" && "rounded-l-none border-l-0 ml-0",
      position === "standalone" && "rounded"
    ),
    outline: "bg-transparent text-black border-2 border-black"
  };

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => {
        setIsHovering(true);
      }}
      onHoverEnd={() => {
        setIsHovering(false);
      }}
    >
      <Link href={href} className="relative z-10 flex items-center justify-center h-full w-full" onClick={onClick}>
        {children}
      </Link>
      
      <AnimatePresence>
        {isHovering && sparkles.map((sparkle) => (
          <Sparkle
            key={sparkle.id}
            style={{
              top: `${sparkle.startY}%`,
              left: `${sparkle.startX}%`,
              backgroundColor: sparkle.color,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              endX: sparkle.endX,
              endY: sparkle.endY,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default SparkleButton; 