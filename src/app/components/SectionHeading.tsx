import React from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      {eyebrow ? (
        <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 dark:text-neutral-100">
        {title}
      </h2>
    </div>
  );
}
